const axios = require("axios")
const { comparePassword } = require("../helpers/bcyrpt")
const { signToken } = require("../helpers/jwt")
const { User, Favorite, UserDetail } = require("../models")
const { OAuth2Client } = require("google-auth-library")
const CLIENT_ID =
  "425614752001-tngmaevgsjaggk0oh4uvko5lper71mm1.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID)

/* Register & Login */
class Controller {
  static async userRegister(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await User.create({ email, password })

      res.status(201).json(user)
    } catch (error) {
      next(error)
    }
  }

  static async authGoogleLogin(req, res, next) {
    try {
      const googleToken = req.headers["google-oauth-token"]
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: CLIENT_ID,
      })
      const payload = ticket.getPayload()
      const { email, name } = payload

      const [user, created] = await User.findOrCreate({
        where: { email: email },
        defaults: {
          username: name,
          email: email,
          password: "UsingGoogleToLogin",
        },
        hooks: false,
      })
      const googlePayload = {
        id: user.id,
      }

      const [details, createdDetails] = await UserDetail.findOrCreate({
        where: { UserId: user.id },
      })

      if (!createdDetails) {
        details.UserId = user.id
      }

      const access_token = signToken(googlePayload)
      res.status(200).json({
        message: `Login with ${user.email}`,
        access_token: access_token,
      })
    } catch (error) {
      next(error)
    }
  }

  static async userLogin(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { name: "invalidLogin" }

      const findUser = await User.findOne({ where: { email } })

      if (!findUser) throw { name: "invalidLogin" }

      const validPassword = comparePassword(password, findUser.password)
      if (!validPassword) throw { name: "invalidLogin" }

      const payload = { id: findUser.id }
      const [user, created] = await UserDetail.findOrCreate({
        where: { UserId: findUser.id },
      })

      if (!created) {
        user.UserId = findUser.id
      }
      const access_token = signToken(payload)

      res.status(200).json({ access_token, message: `Logged in as ${email}` })
    } catch (error) {
      next(error)
    }
  }

  /* Add Favorites */
  static async addFavorites(req, res, next) {
    try {
      const { title, description, urlToImage, url } = req.body
      const UserId = req.user.id
      // console.log(UserId, "USER ID USER")
      const findFavorite = await Favorite.findOne({ where: { title: title } })

      if (findFavorite) throw { name: "alreadyExist", table: "favorite" }

      const addFavorites = await Favorite.create({
        title,
        description,
        urlToImage,
        url,
        UserId,
      })
      // console.log(addFavorites)
      res
        .status(201)
        .json({ message: `Success add Favorite to list ${addFavorites.title}` })
    } catch (error) {
      next(error)
    }
  }

  static async findFavorites(req, res, next) {
    try {
      const { id } = req.user
      const options = {}

      options.where = {
        UserId: id,
      }

      const FavoritesList = await Favorite.findAll(options)
      res.status(200).json({ FavoritesList: FavoritesList })
    } catch (error) {
      next(error)
    }
  }
  static async deleteFavorites(req, res, next) {
    try {
      const { id } = req.params

      const deleteFavorites = await Favorite.destroy({ where: { id: id } })

      if (deleteFavorites === 0) throw { name: "Data not found", table: "Favorites" }

      res.status(200).json({ message: "Successfully delete food from Favorites" })
    } catch (error) {
      next(error)
    }
  }

  /* Get Data from database */

  static async getCovidData(req, res, next) {
    try {
      const { data } = await axios({
        url: "https://data.covid19.go.id/public/api/prov.json",
        method: "GET",
      })
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }

  /* UserDetail */
  static async getUserDetail(req, res, next) {
    try {
      const { id } = req.user

      const findUserDetail = await UserDetail.findOne({ where: { UserId: id } })

      if (!findUserDetail) throw { name: "User detail not found", table: "userdetail" }
      res.status(200).json(findUserDetail)
    } catch (error) {
      next(error)
    }
  }

  static async postUserDetail(req, res, next) {
    try {
      const { id } = req.user
      const { fullName, gender, telephone, address, UserId = id } = req.body
      await UserDetail.create({
        fullName,
        gender,
        telephone,
        address,
        UserId,
      })
      res
        .status(201)
        .json({ message: `Successfully add user detail for User : ${fullName}` })
    } catch (error) {
      next(error)
    }
  }

  static async putUserDetail(req, res, next) {
    try {
      const { id } = req.user
      const findUserDetail = await UserDetail.findOne({ where: { UserId: id } })
      if (!findUserDetail) throw { name: "userNotFound" }
      const { fullName, gender, telephone, address } = req.body
      // console.log(req.file, req.body)
      await UserDetail.update(
        {
          fullName,
          gender,
          telephone,
          address,
          profilePict: req.file?.filename,
        },
        { where: { UserId: id } }
      )

      res.status(201).json({
        message: `Successfully update user detail for User : ${findUserDetail.fullName}`,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller

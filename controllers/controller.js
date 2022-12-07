const axios = require("axios")
const { comparePassword } = require("../helpers/bcyrpt")
const { signToken } = require("../helpers/jwt")
const { User, Favorites } = require("../models")

class Controller {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await User.create({ email, password })

      res
        .status(200)
        .json({ message: `Successfully created new User with email : ${email}` })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { name: "invalid Login" }
      const user = await User.findOne({
        where: { email },
      })

      if (!user) throw { name: "invalid Login" }
      const validPassword = comparePassword(password, user.password)
      if (!validPassword) throw { name: "invalid Login" }
      const payload = {
        id: user.id,
      }

      const access_token = signToken(payload)

      res.status(200).json({ access_token, message: `Logged in as : ${email}` })
    } catch (error) {
      next(error)
    }
  }

  static async findUserById(req, res, next) {
    const { id } = req.user
    try {
      const findUser = await User.findByPk(id)
      res.status(200).json({ message: "find User : ", findUser })
    } catch (error) {
      next(error)
    }
  }

  /* Add Edit Delete Favorites */
  static async findFavorites(req, res, next) {
    try {
      const { id } = req.user

      const options = {}

      options.where = {
        UserId: id,
      }
      options.include = [
        {
          model: Food,
        },
      ]

      const FavoritesList = await Favorites.findAll(options)
      res.status(200).json({ FavoritesList: FavoritesList })
    } catch (error) {
      next(error)
    }
  }

  static async createFavorites(req, res, next) {
    try {
      const { title, description, urlToImage } = req.body
      const UserId = req.user.id
      const favorite = await Favorite.create({ title, description, urlToImage, UserId })

      res.status(201).json({
        Favorites: `News with title  "${title}" successfully added to Favorites`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteFavorites(req, res, next) {
    try {
      const { id } = req.params.id

      const deleteFavorites = await Favorites.destroy({ where: { id: id } })

      if (deleteFavorites === 0) throw { name: "Data not found", table: "Favorites" }

      res.status(200).json({ message: "Successfully delete food from Favorites" })
    } catch (error) {
      next(error)
    }
  }

  /* API's */
  static async getCovidData(req, res, next) {
    try {
      const { data } = await axios({
        url: "https://data.covid19.go.id/public/api/prov.json",
        method: "GET",
      })
      res.status(200).json(data)
    } catch (error) {
      console.log(error)
    }
  }
}

/* milih sandbox, development. */

module.exports = Controller

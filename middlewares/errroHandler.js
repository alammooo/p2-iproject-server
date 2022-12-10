function errorHandler(error, req, res, next) {
  console.log("\n====================================\n", error)
  if (error.name === "SequelizeValidationError") {
    error = error.errors.map((el) => el.message)
    return res.status(400).json({ message: error })
  }
  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ message: "Data is not found" })
  } else if (error.name === "SequelizeUniqueConstraintError") {
    error = `${error.errors[0].message}, ${error.errors[0].value}`

    return res.status(400).json({ message: error })
  } else if (error.name === "SequelizeDatbaseError") {
    return res.status(400).json({ message: "Error on Database" })
  } else if (error.name === "invalidLogin") {
    return res.status(401).json({ message: "Invalid Username / Password" })
  } else if (error.name === "JsonWebTokenError" || error.name === "invalid token") {
    return res.status(401).json({ message: "Token is invalid" })
  } else if (error.name === "Data not found" && error.table === "Bookmark") {
    return res.status(404).json({ message: "Favorite is not found" })
  } else if (error.name === "alreadyExist") {
    return res.status(409).json({ message: "Favorite already Exists" })
  } else if (error.name === "Forbidden") {
    return res.status(403).json({ message: "Not Allowed!" })
  } else if (error.name === "Data not found" && error.table === "Favorites") {
    return res.status(403).json({ message: "Favorite not found!" })
  } else if (error.name === "User detail not found" && error.table === "userdetail") {
    return res.status(403).json({ message: "User detail not found!" })
  } else {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

module.exports = errorHandler

"use strict"
const fs = require("fs")
const { hashPassword } = require("../helpers/bcyrpt")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const data = JSON.parse(fs.readFileSync("./data/patient.json", "utf-8")).map(
      (data) => {
        data.password = hashPassword(data.password)
        data.createdAt = new Date()
        data.updatedAt = new Date()

        return data
      }
    )

    await queryInterface.bulkInsert("Users", data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  },
}

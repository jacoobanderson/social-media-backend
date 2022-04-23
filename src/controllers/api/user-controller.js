import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Gets user data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserData (req, res, next) {
    try {
      const user = await User.findById(req.params.id)
      res.status(201).json({
        id: user.id,
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
        programming: user.programming,
        goals: user.goals,
        description: user.description,
        school: user.school,
        location: user.location,
        image: user.image
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Updates user profile.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updateProfile (req, res, next) {
    try {
      const user = await User.findById(req.params.id)

      await user.update({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        programming: req.body.programming,
        goals: req.body.goals,
        description: req.body.description,
        school: req.body.school,
        location: req.body.location,
        image: req.body.image
      })
      res.status(204).end()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Gets all the users that the user has not matched with.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllUnmatchedUsers (req, res, next) {
    try {
      const users = await User.find({})
      const unmatchedUsers = []

      users.forEach(user => {
        let check = false
        for (let i = 0; i < user.declinedMatches.length; i++) {
          if (user.declinedMatches[i] === req.params.id) {
            check = true
          }
        }
        if (user.id === req.params.id) {
          check = true
        }

        if (check === false) {
          unmatchedUsers.push({
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName,
            programming: user.programming,
            goals: user.goals,
            description: user.description,
            school: user.school,
            location: user.location,
            image: user.image
          })
        }
      })

      res.json(unmatchedUsers)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Adds a friend.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
   async addFriend (req, res, next) {
    try {
      const user = await User.findById(req.params.id)

      user.friends.push({
        id: req.body.id,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        programming: req.body.programming,
        goals: req.body.goals,
        description: req.body.description,
        school: req.body.school,
        location: req.body.location,
        image: req.body.image
      })

      await user.save()
      res.status(204).end()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Adds declined matches.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param choice
   */
     async saveMatchHistory (req, res, next, choice) {
      try {
        const user = await User.findById(req.params.id)
  
        choice ? user.acceptedMatches.push(req.body.id) : user.declinedMatches.push(req.body.id)
  
        await user.save()
        res.status(204).end()
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
}

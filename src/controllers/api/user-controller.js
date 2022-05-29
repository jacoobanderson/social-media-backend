import createError from 'http-errors'
import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Creates an object depending on type.
   *
   * @param {object} type type of data used.
   * @returns {object} Object of user data.
   */
  createUserDataObject (type) {
    return {
      id: type.id,
      username: type.username,
      firstname: type.firstName,
      lastname: type.lastName,
      programming: type.programming,
      goals: type.goals,
      description: type.description,
      school: type.school,
      location: type.location,
      image: type.image
    }
  }

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
      const data = this.createUserDataObject(await user)

      res.status(200).json(data)
    } catch (error) {
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
      const data = this.createUserDataObject(req.body)

      await user.update({
        id: req.body.id,
        username: req.body.username,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        programming: req.body.programming,
        goals: req.body.goals,
        description: req.body.description,
        school: req.body.school,
        location: req.body.location,
        image: req.body.image
      })
      res.status(204).end()
    } catch (error) {
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
      const currentUser = await User.findById(req.params.id)
      const unmatchedUsers = []

      users.forEach(user => {
        // If check is false, the user is sent to the client.
        let check = false

        // Check if current user has declined the user, if so, don't send.
        for (let i = 0; i < currentUser.declinedMatches.length; i++) {
          if (currentUser.declinedMatches[i] === user.id) {
            check = true
          }
        }

        // Check if current user has accepted the user, if so, don't send.
        for (let i = 0; i < currentUser.acceptedMatches.length; i++) {
          if (currentUser.acceptedMatches[i] === user.id) {
            check = true
          }
        }

        // Check if a user is a friend of the current user, if so, don't send.
        for (let i = 0; i < user.friends.length; i++) {
          if (user.friends[i].id === req.params.id) {
            check = true
          }
        }

        // Check if the user is the current user, if so, don't send.
        if (user.id === req.params.id) {
          check = true
        }

        if (check === false) {
          const data = this.createUserDataObject(user)
          unmatchedUsers.push(data)
        }
      })

      res.json(unmatchedUsers)
    } catch (error) {
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
      next(error)
    }
  }

  /**
   * Adds declined matches.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {boolean} choice the choice of the user.
   */
  async saveMatchHistory (req, res, next, choice) {
    try {
      const user = await User.findById(req.params.id)

      // Checks if a accept or decline match should be added to the user.
      choice ? user.acceptedMatches.push(req.body.id) : user.declinedMatches.push(req.body.id)

      await user.save()
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Checks if two users have chosen to connect and if so adds as friends.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async checkIfFriends (req, res, next) {
    try {
      const currentUser = await User.findById(req.params.id)
      const user = await User.findById(req.body.id)

      if (user.acceptedMatches.includes(req.params.id) && currentUser.acceptedMatches.includes(req.body.id)) {
        // remove sensitive infromation before push
        currentUser.friends.push({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          programming: user.programming,
          goals: user.goals,
          description: user.description,
          school: user.school,
          location: user.location,
          image: user.image
        })

        user.friends.push({
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          programming: currentUser.programming,
          goals: currentUser.goals,
          description: currentUser.description,
          school: currentUser.school,
          location: currentUser.location,
          image: currentUser.image
        })
      } else {
        next(createError(404))
      }
      await user.save()
      await currentUser.save()
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Checks if two users have chosen to connect and if so adds as friends.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getFriends (req, res, next) {
    try {
      const user = await User.findById(req.params.id)
      const friends = []

      for (let i = 0; i < user.friends.length; i++) {
        friends.push({
          id: user.friends[i].id,
          firstName: user.friends[i].firstName,
          lastName: user.friends[i].lastName,
          image: user.friends[i].image
        })
      }

      res.status(200).json(friends)
    } catch (error) {
      next(error)
    }
  }
}

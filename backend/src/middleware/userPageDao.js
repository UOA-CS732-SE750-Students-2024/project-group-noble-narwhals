
function getUserParticipatingGroups(Model, entityName) {
  return async function (req, res, next) {
    let entity;
    try {
      entity
        = await Model.findById(req.params.id)
          .populate({
            path: 'profileTags', // Simple population
            model: 'Tag' // Explicitly specify the model if it's not obvious
          })
          .populate({
            path: 'participatingGroups',
            populate: [{
              path: 'groupMembers',
              model: 'User'
            }, {
              path: 'groupApplicants',
              model: 'User'
            }, {
              path: 'groupTags',
              model: 'Tag'
            }, {
              path: 'ownerId',
              model: 'User',
            }]
          });
    }
    catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res[entityName.toLowerCase()] = entity;
    next();
  }
}

function getUserLikedGroups(Model, entityName) {
  return async function (req, res, next) {
    let entity;
    try {
      entity
        = await Model.findById(req.params.id)
          .populate({
            path: 'likedGroups',
            populate: [{
              path: 'groupMembers',
              model: 'User'
            }, {
              path: 'groupApplicants',
              model: 'User'
            }, {
              path: 'groupTags',
              model: 'Tag'
            }, {
              path: 'ownerId',
              model: 'User'
            }]
          });
    }
    catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res[entityName.toLowerCase()] = entity;
    next();
  }
}

function getUserAppliedGroups(Model, entityName) {
  return async function (req, res, next) {
    let entity;
    try {
      entity
        = await Model.findById(req.params.id)
          .populate({
            path: 'appliedGroups',
            populate: [{
              path: 'groupMembers',
              model: 'User'
            }, {
              path: 'groupApplicants',
              model: 'User'
            }, {
              path: 'groupTags',
              model: 'Tag'
            }, {
              path: 'ownerId',
              model: 'User'
            }]
          });
    }
    catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res[entityName.toLowerCase()] = entity;
    next();
  }
}

export { getUserParticipatingGroups, getUserLikedGroups, getUserAppliedGroups };

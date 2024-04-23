function getUserData(Model, entityName) {
  return async function (req, res, next) {
    try {
      const entity = await Model.findById(req.params.id)
        .populate({
          path: 'profileTags', 
          model: 'Tag'
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
        })
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
        })
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

      if (!entity) {
        return res.status(404).json({ message: `${entityName} not found` });
      }

      res[entityName.toLowerCase()] = entity;
      next();
      
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export { getUserData };

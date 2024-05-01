import Application from "../models/applicationModel.js";
import Group from "../models/groupModel.js";
import Notification from "../models/notificationModel.js";
import Tag from "../models/tagModel.js";
import User from "../models/userModel.js";

export const getApplication = getEntityMiddleware(Application, "Application");
export const getGroup = getEntityMiddleware(Group, "Group");
export const getNotification = getEntityMiddleware(
  Notification,
  "Notification"
);
export const getTag = getEntityMiddleware(Tag, "Tag");
export const getUser = getEntityMiddleware(User, "User");

function getEntityMiddleware(Model, entityName) {

  return async function (req, res, next) {
    let entity;
    try {
      if (entityName === "User") {
        entity = await Model.findById(req.params.id).populate("profileTags");
      } else {
        entity = await Model.findById(req.params.id);
      }
      if (entity == null) {
        return res.status(404).json({ message: `Cannot find ${entityName}` });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    res[entityName.toLowerCase()] = entity;
    next();
  };

}

export default getEntityMiddleware;

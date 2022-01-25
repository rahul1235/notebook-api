const express = require("express");

const router = express.Router();
const { fetchUser } = require("../middlewares/validateUser");
const Notes = require("../models/Notes");
const { createNotesSchema } = require("../validations");
const { formatValidationError } = require("../utils/helper");

const STATUS_ERROR = "ERROR";
const STATUS_SUCCESS = "SUCCESS";

router.get("/notes", [fetchUser], async (req, res) => {
  try {
    const { user } = req;
    const notes = await Notes.find({
      user: user.id,
    });
    return res.send({ status: STATUS_SUCCESS, data: notes });
  } catch (err) {
    return res
      .status(500)
      .send({ status: STATUS_ERROR, message: "internal server error" });
  }
});

router.post("/notes", [fetchUser], async (req, res) => {
  try {
    const bodyData = req.body;
    const check = await createNotesSchema(bodyData);
    if (check !== true) {
      const errors = formatValidationError({ check });
      return res.status(400).send({
        message: "Validation Error",
        errors,
      });
    }
    const { user } = req;
    const notes = await Notes.create({
      user: user.id,
      title: bodyData.title,
      description: bodyData.description,
    });
    return res.send({ status: STATUS_SUCCESS, data: notes });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res
      .status(500)
      .send({ status: STATUS_ERROR, message: "internal server error" });
  }
});

router.put("/notes/:id", [fetchUser], async (req, res) => {
  try {
    const bodyData = req.body;
    const noteId = req.params.id;
    if (!Notes.db.base.isValidObjectId(noteId)) {
      return res.status(400).send({
        status: STATUS_ERROR,
        message: "invalid note id ",
      });
    }

    const note = await Notes.findById(`${noteId}`);
    if (!note) {
      return res.status(400).send({
        status: STATUS_ERROR,
        message: "not found",
      });
    }
    // note.user
    if (note.user.toString() !== req.user.id) {
      return res.status(400).send({
        status: STATUS_ERROR,
        message: "not allowed",
      });
    }

    if (bodyData.title) {
      note.title = bodyData.title;
    }
    if (bodyData.description) {
      note.description = bodyData.description;
    }
    if (bodyData.tag) {
      note.tag = bodyData.tag;
    }

    note.save();

    return res.send(note);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res
      .status(500)
      .send({ status: STATUS_ERROR, message: "internal server error" });
  }
});

router.delete("/notes/:id", [fetchUser], async (req, res) => {
  try {
    const noteId = req.params.id;
    if (!Notes.db.base.isValidObjectId(noteId)) {
      return res.status(400).send({
        status: STATUS_ERROR,
        message: "invalid note id ",
      });
    }
    const note = await Notes.findById(`${noteId}`);
    if (!note) {
      return res.status(400).send({
        status: STATUS_ERROR,
        message: "not found",
      });
    }
    // note.user
    if (note.user.toString() !== req.user.id) {
      return res.status(400).send({
        status: STATUS_ERROR,
        message: "not allowed",
      });
    }

    note.delete();

    return res.send({
      status: STATUS_SUCCESS,
      message: "note deleted successfully",
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res
      .status(500)
      .send({ status: STATUS_ERROR, message: "internal server error" });
  }
});

module.exports = router;

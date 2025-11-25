import express from "express";
import mongoose from "mongoose";
import Folder from "../models/Folder.js";
import Card from "../models/Card.js";
import Topic from "../models/Topic.js";

const router = express.Router();

router.post("/homepage/newflashcardset/cards", async (req, res) => {
  try {
    const { cards, folderID, topicID } = req.body;
    if (
      !cards ||
      !Array.isArray(cards) ||
      cards.length === 0 ||
      !folderID ||
      !topicID
    ) {
      return res
        .status(400)
        .json({ message: "cards, folderID, topicID are required" });
    }
    const folder = await Folder.findById(folderID);
    if (!folder) {
      return res.status(400).json({ message: "folder isn't found" });
    }
    const topic = await Topic.findById(topicID);
    if (!topic) {
      return res.status(400).json({ message: "topic isn't found" });
    }

    const createdCards = [];

    for (let card of cards) {
      if (
        !card.term ||
        !card.definition ||
        card.term.trim() === "" ||
        card.definition.trim() === ""
      ) {
        console.log("Пропущена карточка с пустыми полями:", card);
        continue;
      }

      const newCard = new Card({
        term: card.term,
        definition: card.definition,
        positionInTheCollection: card.positionInTheCollection,
        privilege: false,
        topic: topicID,
      });
      await newCard.save();
      topic.topicSize+=1;
      await topic.save();
      createdCards.push(newCard);
    }

    return res.status(201).json(createdCards);
  } catch (err) {
    console.error("Create cards error: ", err);
    res.status(500).json(err);
  }
});
router.patch('/homepage/cards', async(req, res)=>{
  try{
    const {id} = req.body
    const card = await Card.findById(id)
    if(!card || !id){
      res.status(404).json({message:"card or id arent found"})
    }
    card.privilege=!card.privilege
    await card.save()
    return res.status(200).json(card)
  }
  catch(err){
    console.error('change privilege status error', err)
    res.status(500).json(err)
  }
})
export default router;

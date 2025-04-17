
const HyperLinkModel = require('../Model/HyperLink.model');
const log = require("../Model/Log.model");


// Create HyperLink
const createHyperLink = async (req, res) => {
  try {
    const { name, url } = req.body;
    const userId = req.user.id;
    if (!name || !url) {
      return res.status(200).json({ msg: 'Name and URL are required' });
    }

    const hyplnk = await HyperLinkModel.findOne({ name });

    if (url) {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(url)) {
        return res.status(200).json({ msg: 'Please provide a valid URL' });
      }
    }

    if (hyplnk) {
      return res.status(200).json({ msg: "Name already exists" });
    }
    else {
      const creat = await HyperLinkModel.create({
        name: name,
        url: url,
        AddedById: userId,
      });

      res.status(201).json({ msg: 'Hyperlink created successfully', data: creat });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create hyperlink' });
  }
};


//DeleteHyperLink 


const deleteHyperLink = async (req, res) => {

  try {
    
    const { id } = req.params;

    const hyperLinkToDelete = await HyperLinkModel.findById(id);

    if (!hyperLinkToDelete) {
      return res.status(200).json({ msg: 'Hyperlink not found' });
    }

    await HyperLinkModel.findByIdAndDelete(id);

    res.status(200).json({ msg: 'Hyperlink deleted successfully' });

  } catch (err) {
    console.error('Error deleting hyperlink:', err);
    res.status(500).json({ msg: 'Failed to delete hyperlink' });
  }
};

//getHyperLink

const getHyperLink = async (req, res) => {
  try {


    const hyperlinks = await HyperLinkModel.find();

    if (!hyperlinks || hyperlinks.length === 0) {
      return res.status(200).json({ msg: 'No hyperlinks found' });
    }


    res.status(200).json({ msg: 'All Hyperlinks fetched successfully', data: hyperlinks });


  } catch (err) {
    console.error('Error fetching hyperlinks:', err);
    res.status(500).json({ msg: 'Failed to fetch hyperlinks' });
  }
};

//updateHyperLink

const updateHyperLink = async (req, res) => {

  try {

    const { editFormData } = req.body;
    const url = editFormData.url;
    const name = editFormData.name;

    if (!name && !url) {
      return res.status(200).json({ msg: 'At least one field (name or url) is required to update' });
    }

    const hyperlink = await HyperLinkModel.findById(editFormData.id);

    if (!hyperlink) {
      return res.status(200).json({ msg: 'Hyperlink not found' });
    }

    if (name) {
      hyperlink.name = name;
    }
    if (url) {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(url)) {
        return res.status(200).json({ msg: 'Please provide a valid URL' });
      }
      hyperlink.url = url;
    }

    const updatedHyperlink = await hyperlink.save();

    res.status(200).json({
      msg: 'Hyperlink updated successfully',
      data: updatedHyperlink,
    });
  } catch (err) {
    console.error('Error updating hyperlink:', err);
    res.status(500).json({ msg: 'Failed to update hyperlink' });
  }
};

module.exports = { createHyperLink, deleteHyperLink, getHyperLink, updateHyperLink };

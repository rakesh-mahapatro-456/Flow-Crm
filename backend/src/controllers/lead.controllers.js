import Lead from "../models/lead.model.js"
import { leadValidationSchema } from "../../schema.js";


export const createLead = async(req,res)=>{
  const { error, value } = leadValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newLead = new Lead(value); // use validated value
  await newLead.save();

  return res.status(201).json({
    message: "Lead created successfully",
    lead: newLead, // optional: return the created lead
  })
};

//TODO : filter and pagination
export const getLead = async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};

    // --- String fields (contains) ---
    if (req.query.email) filter.email = { $regex: req.query.email, $options: "i" };
    if (req.query.company) filter.company = { $regex: req.query.company, $options: "i" };
    if (req.query.city) filter.city = { $regex: req.query.city, $options: "i" };
    if (req.query.state) filter.state = { $regex: req.query.state, $options: "i" };
    if (req.query.first_name) filter.first_name = { $regex: req.query.first_name, $options: "i" };
    if (req.query.last_name) filter.last_name = { $regex: req.query.last_name, $options: "i" };

    // --- Enum fields (in) ---
    if (req.query.status) filter.status = { $in: req.query.status.split(",") };
    if (req.query.source) filter.source = { $in: req.query.source.split(",") };

    // --- Number fields ---
    if (req.query.score || req.query.minScore || req.query.maxScore) {
      filter.score = {};
      if (req.query.score) filter.score.$eq = Number(req.query.score);
      if (req.query.minScore) filter.score.$gte = Number(req.query.minScore);
      if (req.query.maxScore) filter.score.$lte = Number(req.query.maxScore);
    }

    if (req.query.lead_value || req.query.minValue || req.query.maxValue) {
      filter.lead_value = {};
      if (req.query.lead_value) filter.lead_value.$eq = Number(req.query.lead_value);
      if (req.query.minValue) filter.lead_value.$gte = Number(req.query.minValue);
      if (req.query.maxValue) filter.lead_value.$lte = Number(req.query.maxValue);
    }

    // --- Date fields ---
    if (req.query.created_after || req.query.created_before) {
      filter.created_at = {};
      if (req.query.created_after) filter.created_at.$gte = new Date(req.query.created_after);
      if (req.query.created_before) filter.created_at.$lte = new Date(req.query.created_before);
    }

    if (req.query.last_activity_after || req.query.last_activity_before) {
      filter.last_activity_at = {};
      if (req.query.last_activity_after) filter.last_activity_at.$gte = new Date(req.query.last_activity_after);
      if (req.query.last_activity_before) filter.last_activity_at.$lte = new Date(req.query.last_activity_before);
    }

    // --- Boolean field ---
    if (req.query.is_qualified !== undefined) {
      filter.is_qualified = req.query.is_qualified === "true";
    }

    // --- Total count before pagination ---
    const total = await Lead.countDocuments(filter);

    // --- Fetch leads with pagination ---
    const leads = await Lead.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });

};

export const getLeadById = async(req,res)=>{
    const leadId = req.params.id;

    const leadInfo = await Lead.findById( leadId);

    if (!leadInfo) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json({
        leadInfo : leadInfo,
        message: "Lead retreived successfully",
    });
};

export const updateLead = async(req,res)=>{
    const leadId = req.params.id; //id 
    const updatedInfo = req.body; //updated info of lead 

    //  Validate input
    if (!leadId) {
      return res.status(400).json({ message: "Lead ID not provided" });
    }

    if (!updatedInfo || Object.keys(updatedInfo).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    //  Update lead in DB
    const updatedLead = await Lead.findByIdAndUpdate(leadId, updatedInfo, { new: true });

    //  Handle lead not found
    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    //  Send response
    return res.status(200).json({
      message: "Lead updated successfully",
      updatedLead,
    });
};

export const deleteLead = async(req,res)=>{
    const leadId = req.params.id; //id 

    //  Validate input
    if (!leadId) {
      return res.status(400).json({ message: "Lead ID not provided" });
    }
    
    //find and delete the lead to be deleted
    const deletedLead = await Lead.findByIdAndDelete(leadId);

    //if not found and it return null 
    if (!deletedLead) {
    return res.status(404).json({ message: "Lead not found" });
    }

    //if success send msg
    return res.status(200).json({
      message: "Lead deleted successfully",
      lead : leadId,
    }); 
};


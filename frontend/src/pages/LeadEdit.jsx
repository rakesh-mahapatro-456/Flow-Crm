import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLeadById, updateLead } from "@/store/feature/lead/leadThunk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LoaderThree } from "../components/ui/loader";


export default function LeadEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedLead, loading } = useSelector(state => state.lead);

  // Separate state variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [source, setSource] = useState("website");
  const [status, setStatus] = useState("new");
  const [score, setScore] = useState(0);
  const [leadValue, setLeadValue] = useState(0);
  const [lastActivity, setLastActivity] = useState("");
  const [isQualified, setIsQualified] = useState(false);

  // Load lead data
  useEffect(() => {
    dispatch(getLeadById(id));
  }, [dispatch, id]);


  useEffect(() => {
  if (selectedLead) {
    const l = selectedLead;
    setFirstName(l.first_name || "");
    setLastName(l.last_name || "");
    setEmail(l.email || "");
    setPhone(l.phone || "");
    setCompany(l.company || "");
    setCity(l.city || "");
    setStateField(l.state || "");
    setSource(l.source || "website");
    setStatus(l.status || "new");
    setScore(l.score || 0);
    setLeadValue(l.lead_value || 0);
    setLastActivity(l.last_activity_at ? l.last_activity_at.split("T")[0] : "");
    setIsQualified(l.is_qualified || false);
  }
}, [selectedLead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateLead({
        id,
        updatedInfo: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          company,
          city,
          state: stateField,
          source,
          status,
          score,
          lead_value: leadValue,
          last_activity_at: lastActivity,
          is_qualified: isQualified,
        }
      })).unwrap();

      toast("Lead updated successfully!");
      navigate("/leads");
    } catch (err) {
      toast("Failed to update lead");
    }
  };

  if (loading || !selectedLead) {
  return (
     <div className="flex items-center justify-center h-screen">
      <LoaderThree />
      </div>
  );
}

  return (
    <form className="w-full min-h-full p-6 overflow-y-auto bg-background space-y-6" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold mb-4">Edit Lead</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>First Name</Label>
          <Input value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Last Name</Label>
          <Input value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Phone</Label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Company</Label>
          <Input value={company} onChange={e => setCompany(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>City</Label>
          <Input value={city} onChange={e => setCity(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>State</Label>
          <Input value={stateField} onChange={e => setStateField(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Source</Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
              <SelectItem value="google_ads">Google Ads</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="won">Won</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Score</Label>
          <Input type="number" value={score} onChange={e => setScore(parseInt(e.target.value))} min={0} max={100} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Lead Value</Label>
          <Input type="number" value={leadValue} onChange={e => setLeadValue(parseFloat(e.target.value))} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Last Activity</Label>
          <Input type="date" value={lastActivity} onChange={e => setLastActivity(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2 mt-6">
          <Checkbox checked={isQualified} onCheckedChange={setIsQualified} />
          <Label>Qualified</Label>
        </div>
      </div>
      <Button type="submit" className="mt-6 w-full">Save Lead</Button>
    </form>
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createLead } from "@/store/feature/lead/leadThunk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LoaderThree } from "../components/ui/loader";

export function LeadForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.lead);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createLead(formData));
      toast("Lead created successfully!");
      navigate("/leads"); // redirect to lead list
    } catch (err) {
      toast("Failed to create lead");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderThree />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6">Create Lead</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <Label>First Name</Label>
            <Input name="first_name" value={formData.first_name} onChange={handleChange} required className="h-12 text-base" />
          </div>
          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <Label>Last Name</Label>
            <Input name="last_name" value={formData.last_name} onChange={handleChange} required className="h-12 text-base" />
          </div>
          {/* Email */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="h-12 text-base" />
          </div>
          {/* Phone */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} required className="h-12 text-base" />
          </div>
          {/* Company */}
          <div className="flex flex-col gap-2">
            <Label>Company</Label>
            <Input name="company" value={formData.company} onChange={handleChange} required className="h-12 text-base" />
          </div>
          {/* City */}
          <div className="flex flex-col gap-2">
            <Label>City</Label>
            <Input name="city" value={formData.city} onChange={handleChange} required className="h-12 text-base" />
          </div>
          {/* State */}
          <div className="flex flex-col gap-2">
            <Label>State</Label>
            <Input name="state" value={formData.state} onChange={handleChange} required className="h-12 text-base" />
          </div>
          {/* Source */}
          <div className="flex flex-col gap-2">
            <Label>Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
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
          {/* Submit */}
          <div className="md:col-span-2">
            <Button type="submit" className="w-full mt-4 h-12 text-base">Create Lead</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

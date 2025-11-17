"use client";

import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";

type UserRole = "YOUTH" | "DONOR" | "ADMIN" | "FIELD_AGENT";
type YouthCategory = "REFUGEE" | "IDP" | "VULNERABLE" | "PWD";

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>("YOUTH");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<YouthCategory>("REFUGEE");
  const [country, setCountry] = useState("");
  const [camp, setCamp] = useState("");
  const [community, setCommunity] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
        ...(role === "YOUTH" && {
          category,
          country,
          camp,
          community,
          dateOfBirth,
          gender,
        }),
        ...(role === "DONOR" && {
          organizationName,
          organizationType,
        }),
      });
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            RiseUp Africa
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Create an account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Join RiseUp Africa to access opportunities
                  </p>
                </div>

                <Field>
                  <FieldLabel>I am a...</FieldLabel>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as UserRole)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="YOUTH" id="youth" />
                      <Label htmlFor="youth">Youth</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DONOR" id="donor" />
                      <Label htmlFor="donor">Donor/NGO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ADMIN" id="admin" />
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FIELD_AGENT" id="field-agent" />
                      <Label htmlFor="field-agent">Field Agent</Label>
                    </div>
                  </RadioGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={8}
                  />
                  <FieldDescription>
                    Must be at least 8 characters
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </Field>

                {role === "YOUTH" && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Select
                        value={category}
                        onValueChange={(value) =>
                          setCategory(value as YouthCategory)
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REFUGEE">Refugee</SelectItem>
                          <SelectItem value="IDP">Internally Displaced Person</SelectItem>
                          <SelectItem value="VULNERABLE">Vulnerable</SelectItem>
                          <SelectItem value="PWD">Person with Disability</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="country">Country</FieldLabel>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={loading}
                        placeholder="e.g., Kenya"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="camp">Camp/Community</FieldLabel>
                      <Input
                        id="camp"
                        value={camp}
                        onChange={(e) => setCamp(e.target.value)}
                        disabled={loading}
                        placeholder="e.g., Kakuma Refugee Camp"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="community">Community</FieldLabel>
                      <Input
                        id="community"
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        disabled={loading}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        disabled={loading}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>
                      <Select
                        value={gender}
                        onValueChange={setGender}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </>
                )}

                {role === "DONOR" && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="organizationName">
                        Organization Name
                      </FieldLabel>
                      <Input
                        id="organizationName"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        disabled={loading}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="organizationType">
                        Organization Type
                      </FieldLabel>
                      <Input
                        id="organizationType"
                        value={organizationType}
                        onChange={(e) => setOrganizationType(e.target.value)}
                        disabled={loading}
                        placeholder="e.g., NGO, Foundation"
                      />
                    </Field>
                  </>
                )}

                <Field>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Login
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h2 className="text-3xl font-bold">Empower African Youth</h2>
            <p className="text-muted-foreground">
              Connect marginalized youth with life-changing opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


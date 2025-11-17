"use client";

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import Image from "next/image"
import { IconBriefcase, IconUsers, IconCheck, IconHeart, IconTarget, IconShieldCheck, IconSchool } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function Page() {
  return (
    <div className="flex flex-col min-h-svh">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <IconHeart className="h-6 w-6 text-primary" />
            RiseUp Africa
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Empowering African Youth
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect marginalized youth (Refugees, IDPs, Vulnerable, PWDs) with verified access to post-secondary opportunities
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">Join as Youth</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register">Post Opportunities</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/hero-image.png"
                alt="African youth accessing education opportunities"
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to bridge the gap between marginalized youth and life-changing opportunities
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <IconUsers className="h-12 w-12 text-primary mb-4" />
                <CardTitle>For Youth</CardTitle>
                <CardDescription>
                  Access verified opportunities and track your applications
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <IconBriefcase className="h-12 w-12 text-primary mb-4" />
                <CardTitle>For Donors</CardTitle>
                <CardDescription>
                  Post opportunities and connect with verified youth
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <IconCheck className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Access</CardTitle>
                <CardDescription>
                  Secure verification process ensures trust and safety
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <IconHeart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Transform Lives</CardTitle>
                <CardDescription>
                  Make a real difference in the lives of marginalized youth
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* About Us Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                <Image
                  src="/images/about-us.jpg"
                  alt="About RiseUp Africa - Community supporting youth"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold">About RiseUp Africa</h2>
                <p className="text-lg text-muted-foreground">
                  RiseUp Africa is a comprehensive platform dedicated to empowering marginalized African youth by providing verified access to post-secondary education opportunities.
                </p>
                <p className="text-muted-foreground">
                  We serve refugees, internally displaced persons (IDPs), vulnerable youth, and persons with disabilities (PWDs) across the continent. Our mission is to break down barriers and create pathways to success through education, skills training, and meaningful opportunities.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">Youth Registered</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Opportunities Posted</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">200+</div>
                    <div className="text-sm text-muted-foreground">Verified Youth</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Partner Organizations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact/Stats Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transforming lives through education and opportunity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <IconSchool className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-4xl font-bold">85%</CardTitle>
                <CardDescription className="text-lg">
                  Success Rate
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  Of verified youth successfully access opportunities
                </p>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <IconTarget className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-4xl font-bold">15+</CardTitle>
                <CardDescription className="text-lg">
                  Countries Served
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  Across East, West, Central, and Southern Africa
                </p>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <IconShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-4xl font-bold">100%</CardTitle>
                <CardDescription className="text-lg">
                  Verified Access
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  All opportunities require verified youth status
                </p>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simple steps to connect youth with opportunities
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold">Register & Verify</h3>
                <p className="text-muted-foreground">
                  Youth register, upload documents, and go through our verification process
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold">Browse Opportunities</h3>
                <p className="text-muted-foreground">
                  Access verified opportunities from trusted donors and organizations
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold">Apply & Succeed</h3>
                <p className="text-muted-foreground">
                  Apply to opportunities and track your application status
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Ready to Make a Difference?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Join thousands of youth and organizations working together to transform lives
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Get Started as Youth</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/register">Post Opportunities</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg mb-4">
                <IconHeart className="h-6 w-6 text-primary" />
                RiseUp Africa
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering African youth with verified access to post-secondary opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Youth</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-foreground">Register</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
                <li><Link href="/dashboard/opportunities" className="hover:text-foreground">Browse Opportunities</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Donors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-foreground">Post Opportunities</Link></li>
                <li><Link href="/dashboard/search" className="hover:text-foreground">Search Youth</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground">About Us</a></li>
                <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t pt-8">
            <p>&copy; 2024 RiseUp Africa. Empowering African youth with opportunities.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

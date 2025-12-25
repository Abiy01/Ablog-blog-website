import { ArrowRight, Heart, Lightbulb, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const values = [
  {
    icon: Heart,
    title: 'Passion for Writing',
    description: 'We believe great writing has the power to inspire, educate, and connect people across the globe.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Constantly exploring new ideas and technologies to create the best possible reading experience.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a supportive community of writers and readers who share knowledge freely.'
  },
  {
    icon: Target,
    title: 'Quality',
    description: 'Every article is crafted with care, ensuring accuracy, clarity, and value for our readers.'
  }
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'Former tech journalist with a passion for design and storytelling.'
  },
  {
    name: 'Abiy Aragie',
    role: 'Founder & Editor-in-Chief',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Full-stack developer who believes in the power of simple, elegant solutions.'
  },
  {
    name: 'Emily Watson',
    role: 'Content Strategist',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Content specialist helping writers find their voice and reach their audience.'
  }
];

export default function About() {
  return (
    <>
      {/* SEO */}
      <title>About Us - Ablog</title>
      <meta name="description" content="Learn about Ablog, our mission, values, and the team behind the platform." />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About Ablog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We're on a mission to create a space where ideas flourish, 
              stories are shared, and knowledge flows freely.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Ablog was born from a simple idea: everyone has a story worth telling. 
                  We created this platform to give writers, thinkers, and creators a beautiful 
                  space to share their ideas with the world.
                </p>
                <p>
                  What started as a personal blog has grown into a thriving community of 
                  passionate individuals who believe in the power of words. Today, we host 
                  thousands of articles on topics ranging from design and technology to 
                  personal growth and creativity.
                </p>
                <p>
                  Our mission is simple: to democratize publishing and help every voice 
                  be heard. Whether you're a seasoned writer or just starting out, 
                  Ablog is your home.
                </p>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at Ablog.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="p-6 rounded-xl bg-card border border-border/50 shadow-soft animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Meet the Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Ablog.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-soft">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Join Our Journey
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether you want to contribute or simply stay updated with our latest stories, 
              we'd love to have you as part of our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Read Our Blog
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

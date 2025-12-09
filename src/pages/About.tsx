import { Heart, Sparkles, Award, Clock } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-pink-100 opacity-50"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-rose-500 mr-3" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">
              My Story
            </h1>
            <Heart className="w-8 h-8 text-rose-500 ml-3" />
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Welcome to Woolwitch, where every stitch tells a story of passion, creativity, and love.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* My Mission */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              I believe in the magic of handmade. Each piece is crafted with meticulous attention 
              to detail, using only the finest materials and time-honored techniques passed down through generations. 
              I'm not just creating crochet items – I'm weaving memories, comfort, and joy into every thread.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-100">
              <div className="flex items-center mb-4">
                <Sparkles className="w-8 h-8 text-rose-500 mr-3" />
                <h3 className="text-xl font-serif font-bold text-gray-900">Handcrafted Excellence</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Every item is individually crafted by me, pouring my heart and soul into each piece. 
                No mass production, no shortcuts – just pure craftsmanship and dedication.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-100">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-rose-500 mr-3" />
                <h3 className="text-xl font-serif font-bold text-gray-900">Premium Materials</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                I source only the finest yarns and materials, ensuring that each creation is not only beautiful 
                but also durable and comfortable for years to come.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-100">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-rose-500 mr-3" />
                <h3 className="text-xl font-serif font-bold text-gray-900">Made with Love</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Behind every stitch is a story of passion. I don't just make products; I create treasures 
                that bring warmth, comfort, and happiness to your life.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-100">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-rose-500 mr-3" />
                <h3 className="text-xl font-serif font-bold text-gray-900">Time-Honored Tradition</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                My techniques honor centuries-old traditions while embracing modern design sensibilities, 
                creating pieces that are both timeless and contemporary.
              </p>
            </div>
          </div>

          {/* The Artisan */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Meet the Woolwitch</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              I'm a passionate crafter from Cardiff with over a decade of experience in the art of crochet. 
              Woolwitch was born from a simple desire: to share the beauty and comfort of handmade items 
              with the world.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              What started as a hobby in my Cardiff home has grown into a loving business that serves 
              customers who appreciate the artistry, quality, and personal touch that only handmade 
              items can provide.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
            Thank you for being part of my story
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Every purchase supports my small business and keeps the beautiful tradition of handcrafting alive.
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
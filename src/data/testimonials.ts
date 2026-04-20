export type Testimonial = {
  name: string
  role: string
  content: string
  rating: number
  event: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Birthday Party',
    content: 'The candy table was absolutely stunning! Everyone at my daughter\'s birthday party couldn\'t believe how beautiful everything looked. The attention to detail was incredible.',
    rating: 5,
    event: 'Birthday Celebration',
  },
  {
    name: 'Michael Chen',
    role: 'Wedding Reception',
    content: 'Pretty Party Sweets made our wedding dessert table a dream come true. The custom colors matched our theme perfectly, and the treats were delicious!',
    rating: 5,
    event: 'Wedding',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Baby Shower Host',
    content: 'I was blown away by the quality and presentation. The team went above and beyond to make my baby shower special. Highly recommend!',
    rating: 5,
    event: 'Baby Shower',
  },
  {
    name: 'David Thompson',
    role: 'Corporate Event',
    content: 'Professional service from start to finish. The dessert buffet was the highlight of our company event. Will definitely book again!',
    rating: 5,
    event: 'Corporate Event',
  },
]

export const homeTestimonials = testimonials.slice(0, 3)

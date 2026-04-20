export type GalleryItem = {
  id: number
  title: string
  category: string
  color: string
}

export const galleryItems: GalleryItem[] = [
  { id: 1, title: 'Birthday Candy Table', category: 'Candy Tables', color: '#ff5fa2' },
  { id: 2, title: 'Wedding Cake', category: 'Cakes', color: '#ffd6e7' },
  { id: 3, title: 'Chocolate Strawberries', category: 'Dipped Treats', color: '#ff8fc4' },
  { id: 4, title: 'Custom Cookies', category: 'Cookies', color: '#fff0f6' },
  { id: 5, title: 'Baby Shower Setup', category: 'Events', color: '#e34d8e' },
  { id: 6, title: 'Dessert Buffet', category: 'Candy Tables', color: '#ff5fa2' },
  { id: 7, title: 'Anniversary Cake', category: 'Cakes', color: '#ffd6e7' },
  { id: 8, title: 'Oreo Pops', category: 'Dipped Treats', color: '#ff8fc4' },
  { id: 9, title: 'Macaron Tower', category: 'Cookies', color: '#fff0f6' },
  { id: 10, title: 'Corporate Event', category: 'Events', color: '#e34d8e' },
  { id: 11, title: 'Candy Bar Display', category: 'Candy Tables', color: '#ff5fa2' },
  { id: 12, title: 'Graduation Cake', category: 'Cakes', color: '#ffd6e7' },
]

export const galleryCategories = ['All', 'Candy Tables', 'Cakes', 'Dipped Treats', 'Cookies', 'Events']

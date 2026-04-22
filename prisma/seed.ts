/**
 * BookBites Seed Script
 * Creates a demo business with user, services, gallery, reviews, and sample bookings.
 * Run: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding BookBites database...\n')

  // Clean existing data (order matters due to foreign keys)
  console.log('  Cleaning existing data...')
  await prisma.businessSession.deleteMany()
  await prisma.businessBooking.deleteMany()
  await prisma.customOrder.deleteMany()
  await prisma.client.deleteMany()
  await prisma.businessLead.deleteMany()
  await prisma.businessReview.deleteMany()
  await prisma.businessGalleryItem.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.menuCategory.deleteMany()
  await prisma.service.deleteMany()
  await prisma.cateringProfile.deleteMany()
  await prisma.businessSettings.deleteMany()
  await prisma.businessNotification.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.businessUser.deleteMany()
  await prisma.business.deleteMany()
  console.log('  ✓ Cleaned\n')

  // ── Create Business ──────────────────────────────────────────────
  console.log('  Creating demo business...')
  const business = await prisma.business.create({
    data: {
      name: "Sweet Delights Bakery",
      slug: "sweet-delights",
      email: "hello@sweetdelights.com",
      phone: "(555) 123-4567",
      description: "Artisan cakes, cupcakes, and desserts for every occasion. Custom orders and full-service catering available.",
      address: "123 Baker Street",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "US",
      primaryColor: "#D4A5B8",
      isActive: true,
      isVerified: true,
      subscriptionTier: "PRO",
      subscriptionStatus: "ACTIVE",
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })
  console.log(`  ✓ Business: ${business.name} (${business.slug})\n`)

  // ── Create Owner User ────────────────────────────────────────────
  console.log('  Creating owner user...')
  const hashedPassword = await bcrypt.hash('demo1234', 12)
  const owner = await prisma.businessUser.create({
    data: {
      email: "demo@bookbites.app",
      password: hashedPassword,
      name: "Naimah Johnson",
      role: "OWNER",
      businessId: business.id,
      isActive: true,
      emailVerified: new Date(),
    },
  })
  console.log(`  ✓ User: ${owner.email} (password: demo1234)\n`)

  // ── Business Settings ────────────────────────────────────────────
  console.log('  Creating business settings...')
  await prisma.businessSettings.create({
    data: {
      businessId: business.id,
      allowOnlineBooking: true,
      allowCustomOrders: true,
      allowCatering: true,
      requireDeposit: true,
      depositPercentage: 50,
      emailNotifications: true,
      timezone: "America/New_York",
      currency: "USD",
      taxRate: 8.875,
      businessHours: JSON.stringify({
        mon: "8:00-20:00", tue: "8:00-20:00", wed: "8:00-20:00",
        thu: "8:00-20:00", fri: "8:00-21:00", sat: "9:00-21:00", sun: "10:00-18:00"
      }),
      minBookingNotice: 48,
    },
  })
  console.log('  ✓ Settings created\n')

  // ── Menu Categories + Items ──────────────────────────────────────
  console.log('  Creating menu categories & items...')
  const catCakes = await prisma.menuCategory.create({
    data: { businessId: business.id, name: "Cakes", sortOrder: 1 },
  })
  const catCupcakes = await prisma.menuCategory.create({
    data: { businessId: business.id, name: "Cupcakes", sortOrder: 2 },
  })
  const catDesserts = await prisma.menuCategory.create({
    data: { businessId: business.id, name: "Desserts", sortOrder: 3 },
  })
  const catDrinks = await prisma.menuCategory.create({
    data: { businessId: business.id, name: "Beverages", sortOrder: 4 },
  })

  const menuItems = [
    { categoryId: catCakes.id, name: "Classic Vanilla Cake", description: "Light and fluffy vanilla sponge with buttercream frosting", price: 45.00, dietaryFlags: null },
    { categoryId: catCakes.id, name: "Chocolate Ganache Cake", description: "Rich chocolate cake with dark ganache and chocolate shavings", price: 55.00, dietaryFlags: null },
    { categoryId: catCakes.id, name: "Red Velvet Cake", description: "Classic red velvet with cream cheese frosting", price: 50.00, dietaryFlags: null },
    { categoryId: catCakes.id, name: "Lemon Raspberry Cake", description: "Tangy lemon cake layered with fresh raspberry compote", price: 52.00, dietaryFlags: null },
    { categoryId: catCupcakes.id, name: "Vanilla Bean Cupcake", description: "Madagascar vanilla bean cupcake with Swiss meringue buttercream", price: 4.50, dietaryFlags: null },
    { categoryId: catCupcakes.id, name: "Salted Caramel Cupcake", description: "Caramel cupcake with salted caramel frosting and drizzle", price: 5.00, dietaryFlags: null },
    { categoryId: catCupcakes.id, name: "Cookies & Cream Cupcake", description: "Chocolate cupcake with Oreo buttercream", price: 4.50, dietaryFlags: null },
    { categoryId: catDesserts.id, name: "Tiramisu", description: "Classic Italian tiramisu with espresso-soaked ladyfingers", price: 8.00, dietaryFlags: "contains-alcohol" },
    { categoryId: catDesserts.id, name: "Crème Brûlée", description: "Vanilla custard with caramelized sugar top", price: 7.50, dietaryFlags: "gluten-free" },
    { categoryId: catDesserts.id, name: "Cheesecake Bites", description: "Mini New York-style cheesecakes with graham cracker crust", price: 3.00, dietaryFlags: null },
    { categoryId: catDrinks.id, name: "Artisan Lemonade", description: "Fresh-squeezed lemonade with lavender and honey", price: 4.00, dietaryFlags: "vegan" },
    { categoryId: catDrinks.id, name: "Iced Chai Latte", description: "Spiced chai tea with oat milk over ice", price: 5.00, dietaryFlags: "vegan" },
  ]
  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: {
        businessId: business.id,
        ...item,
        isActive: true,
        isAvailable: true,
        sortOrder: 0,
      },
    })
  }
  console.log(`  ✓ ${menuItems.length} menu items\n`)

  // ── Services ─────────────────────────────────────────────────────
  console.log('  Creating services...')
  const services = [
    { name: "Custom Cake Consultation", description: "One-on-one consultation to design your dream cake", price: 25.00, duration: 45, category: "event_booking" },
    { name: "Wedding Cake Package", description: "Full wedding cake service including tasting, design, delivery, and setup", price: 350.00, duration: 120, category: "event_booking" },
    { name: "Birthday Party Package", description: "Custom cake + 24 cupcakes for your birthday celebration", price: 120.00, duration: 60, category: "event_booking" },
    { name: "Custom Cookie Order", description: "Decorated sugar cookies with custom designs", price: 45.00, duration: 30, category: "custom_orders" },
    { name: "Dessert Table Setup", description: "Curated dessert table with variety of treats for your event", price: 250.00, duration: 90, category: "catering" },
    { name: "Full Catering Service", description: "Complete food and dessert catering with staff and equipment", price: 500.00, duration: 240, category: "catering" },
  ]
  for (const svc of services) {
    await prisma.service.create({
      data: { businessId: business.id, ...svc, isActive: true, sortOrder: 0 },
    })
  }
  console.log(`  ✓ ${services.length} services\n`)

  // ── Catering Profile ─────────────────────────────────────────────
  console.log('  Creating catering profile...')
  await prisma.cateringProfile.create({
    data: {
      businessId: business.id,
      isEnabled: true,
      minGuestCount: 20,
      maxGuestCount: 300,
      deliveryRadius: 30,
      deliveryFee: 50.00,
      staffCount: 3,
      staffRatePerHour: 35.00,
      setupTime: 90,
      breakdownTime: 45,
      requiresTasting: true,
      tastingFee: 25.00,
      availableCuisines: JSON.stringify(["American", "French", "Italian", "Caribbean"]),
      equipmentProvided: JSON.stringify(["chafing_dishes", "serving_utensils", "tablecloths", "plates", "cutlery"]),
    },
  })
  console.log('  ✓ Catering profile\n')

  // ── Gallery Items ────────────────────────────────────────────────
  console.log('  Creating gallery items...')
  const galleryItems = [
    { title: "Elegant Wedding Cake", description: "Five-tier white fondant wedding cake with sugar flowers", category: "Cakes", isFeatured: true },
    { title: "Birthday Cupcake Tower", description: "Rainbow cupcake tower with custom toppers", category: "Cupcakes", isFeatured: true },
    { title: "Dessert Table Spread", description: "Full dessert catering setup for corporate event", category: "Catering", isFeatured: true },
    { title: "Chocolate Ganache Cake", description: "Rich chocolate ganache drip cake with gold leaf", category: "Cakes", isFeatured: false },
    { title: "Baby Shower Cookies", description: "Custom-decorated sugar cookies for baby shower", category: "Custom Orders", isFeatured: false },
    { title: "Tiramisu Parfaits", description: "Individual tiramisu parfaits for event", category: "Desserts", isFeatured: false },
  ]
  for (const item of galleryItems) {
    await prisma.businessGalleryItem.create({
      data: {
        businessId: business.id,
        ...item,
        imageUrl: `https://placehold.co/600x400/D4A5B8/ffffff?text=${encodeURIComponent(item.title)}`,
        sortOrder: 0,
      },
    })
  }
  console.log(`  ✓ ${galleryItems.length} gallery items\n`)

  // ── Reviews ──────────────────────────────────────────────────────
  console.log('  Creating reviews...')
  const reviews = [
    { customerName: "Sarah M.", rating: 5, comment: "The wedding cake was absolutely stunning! Everyone asked where we got it. The team was so professional and accommodating.", source: "website", isApproved: true, isFeatured: true },
    { customerName: "David K.", rating: 5, comment: "Best cupcakes in Brooklyn, hands down. The salted caramel is to die for!", source: "google", isApproved: true, isFeatured: true },
    { customerName: "Priya R.", rating: 4, comment: "Great custom cookie order for my daughter's birthday. Delivery was on time and cookies were fresh.", source: "website", isApproved: true, isFeatured: false },
    { customerName: "Michael T.", rating: 5, comment: "We used Sweet Delights for our corporate event catering and it was phenomenal. The dessert table was the highlight of the evening.", source: "manual", isApproved: true, isFeatured: true },
    { customerName: "Lisa W.", rating: 4, comment: "Loved the red velvet cake! Only suggestion would be more filling layers, but the flavor was perfect.", source: "website", isApproved: true, isFeatured: false },
    { customerName: "Anonymous", rating: 2, comment: "Delivery was late and cake was slightly damaged.", source: "website", isApproved: false, isFeatured: false },
  ]
  for (const review of reviews) {
    await prisma.businessReview.create({
      data: { businessId: business.id, ...review },
    })
  }
  console.log(`  ✓ ${reviews.length} reviews\n`)

  // ── Clients ──────────────────────────────────────────────────────
  console.log('  Creating clients...')
  const clients = [
    { name: "Sarah Mitchell", email: "sarah@example.com", phone: "(555) 234-5678" },
    { name: "David Kim", email: "david.k@example.com", phone: "(555) 345-6789" },
    { name: "Priya Reddy", email: "priya.r@example.com", phone: "(555) 456-7890" },
    { name: "Michael Torres", email: "mtorres@corp.com", phone: "(555) 567-8901" },
    { name: "Lisa Wang", email: "lisa.w@example.com", phone: "(555) 678-9012" },
  ]
  const clientRecords = []
  for (const client of clients) {
    const record = await prisma.client.create({
      data: { businessId: business.id, ...client },
    })
    clientRecords.push(record)
  }
  console.log(`  ✓ ${clients.length} clients\n`)

  // ── Bookings ─────────────────────────────────────────────────────
  console.log('  Creating bookings...')
  const bookings = [
    { clientId: clientRecords[0].id, customerName: "Sarah Mitchell", customerEmail: "sarah@example.com", eventType: "Wedding", eventDate: new Date("2026-06-15"), totalPrice: 350.00, status: "CONFIRMED", paymentStatus: "PAID", reference: "BK-001", guestCount: 50 },
    { clientId: clientRecords[1].id, customerName: "David Kim", customerEmail: "david@example.com", eventType: "Birthday", eventDate: new Date("2026-05-20"), totalPrice: 120.00, status: "CONFIRMED", paymentStatus: "DEPOSIT_PAID", reference: "BK-002", guestCount: 20 },
    { clientId: clientRecords[2].id, customerName: "Priya Reddy", customerEmail: "priya@example.com", eventType: "Custom Order", eventDate: new Date("2026-05-01"), totalPrice: 45.00, status: "COMPLETED", paymentStatus: "PAID", reference: "BK-003", guestCount: 1 },
    { clientId: clientRecords[3].id, customerName: "Michael Torres", customerEmail: "michael@example.com", eventType: "Corporate Event", eventDate: new Date("2026-07-10"), totalPrice: 500.00, status: "PENDING", paymentStatus: "PENDING", reference: "BK-004", guestCount: 100 },
    { clientId: clientRecords[4].id, customerName: "Lisa Wang", customerEmail: "lisa@example.com", eventType: "Birthday", eventDate: new Date("2026-05-28"), totalPrice: 55.00, status: "CONFIRMED", paymentStatus: "PAID", reference: "BK-005", guestCount: 15 },
  ]
  for (const booking of bookings) {
    await prisma.businessBooking.create({
      data: { businessId: business.id, ...booking },
    })
  }
  console.log(`  ✓ ${bookings.length} bookings\n`)

  // ── Notifications ────────────────────────────────────────────────
  console.log('  Creating notifications...')
  const notifications = [
    { type: "booking", title: "New Booking Request", message: "Michael Torres requested catering for a corporate event on July 10, 2026", actionUrl: "/dashboard/bookings" },
    { type: "review", title: "New Review", message: "Sarah M. left a 5-star review for your wedding cake", actionUrl: "/dashboard/gallery" },
    { type: "payment", title: "Payment Received", message: "Deposit of $175.00 received for wedding cake booking", actionUrl: "/dashboard/finance" },
    { type: "system", title: "Welcome to BookBites!", message: "Your business profile is set up. Start by adding services and menu items.", actionUrl: "/dashboard/settings" },
  ]
  for (const notif of notifications) {
    await prisma.businessNotification.create({
      data: { businessId: business.id, ...notif, isRead: false },
    })
  }
  console.log(`  ✓ ${notifications.length} notifications\n`)

  // ── Summary ──────────────────────────────────────────────────────
  console.log('═'.repeat(50))
  console.log('  🎉 Seed complete!\n')
  console.log('  Login credentials:')
  console.log('    Email:    demo@bookbites.app')
  console.log('    Password: demo1234')
  console.log('    Business: Sweet Delights Bakery')
  console.log('    Slug:     sweet-delights')
  console.log('═'.repeat(50))
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

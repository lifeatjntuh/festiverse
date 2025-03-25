
/**
 * Seed Data for Festiverse
 * 
 * Use this function to generate seed data to be inserted into the database.
 */

export const generateSeedData = (adminId: string) => {
  // Example admin ID: Replace with the actual admin user ID from your database
  const admin_id = adminId || "d457d214-afc8-456f-a4c7-2089c3269ec7";

  const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Generate events
  const eventCategories = [
    'competition', 'workshop', 'stall', 'exhibit', 'performance', 
    'lecture', 'games', 'food', 'merch', 'art', 'sport'
  ];

  const venues = [
    'Main Auditorium', 'Sports Complex', 'Lecture Hall A', 'Engineering Block', 
    'Science Block', 'Open Air Theatre', 'Student Center', 'Library Lawn',
    'Cafeteria', 'Arts Building', 'Computer Lab'
  ];

  const departments = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Physics', 'Chemistry', 'Mathematics', 'Arts',
    'Business Administration', 'Biology', 'Architecture'
  ];

  const colleges = [
    'College of Engineering', 'College of Sciences', 'College of Liberal Arts',
    'School of Management', 'Faculty of Arts and Design'
  ];

  const eventNames = [
    'Hackathon 2025', 'Coding Challenge', 'Robotics Workshop',
    'Dance Competition', 'Music Night', 'Technical Quiz',
    'Research Symposium', 'Alumni Meet', 'Cultural Fest',
    'Sports Day', 'Photography Exhibition', 'Debate Competition',
    'Food Festival', 'Art and Craft Fair', 'Career Fair',
    'Guest Lecture Series', 'Film Screening', 'Gaming Tournament',
    'Fashion Show', 'Poetry Slam'
  ];

  // Sample image URLs for events
  const eventImages = [
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1000',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000',
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1000',
    'https://images.unsplash.com/photo-1560523159-4a9692d222f8?q=80&w=1000',
    'https://images.unsplash.com/photo-1546768292-fb12f6c92568?q=80&w=1000',
    'https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1000'
  ];

  const now = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  // Generate 20 events
  const events = [];
  for (let i = 0; i < 20; i++) {
    const eventDate = getRandomDate(now, oneMonthFromNow);
    const category = eventCategories[Math.floor(Math.random() * eventCategories.length)];
    const venue = venues[Math.floor(Math.random() * venues.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const college = colleges[Math.floor(Math.random() * colleges.length)];
    const name = eventNames[i % eventNames.length];
    const imageUrl = i < 10 ? eventImages[i] : null; // Only add images to some events
    
    events.push({
      name,
      category,
      date: formatDate(eventDate),
      time: formatTime(eventDate),
      venue,
      department,
      college,
      image_url: imageUrl,
      description: `This is a sample description for the ${name} event. It will be held on ${formatDate(eventDate)} at ${venue}. All ${department} students are welcome to participate!`,
      organizer_id: admin_id,
      is_approved: true,
      // Add coordinates for map view
      latitude: 17.4 + (Math.random() * 0.1),   // Sample coordinates near Hyderabad
      longitude: 78.4 + (Math.random() * 0.1)
    });
  }

  // Generate festival updates
  const updateMessages = [
    'Welcome to Festiverse 2025! Get ready for an amazing experience.',
    'The registration for all competitions is now open. Register before the deadline!',
    'Special announcement: Celebrity performance on Day 2. Don\'t miss it!',
    'Due to popular demand, we have extended the registration deadline for Hackathon.',
    'Food stalls will be open from 10 AM to 10 PM every day during the fest.',
    'Workshop registrations are filling up fast! Secure your spot today.',
    'Reminder: All participants must have their ID cards with them at all venues.',
    'Weather update: Expect light rain on Day 3. Indoor events will proceed as scheduled.',
    'Lost and found station has been set up near the registration desk.',
    'Technical issues with the online registration have been resolved. Thanks for your patience!'
  ];

  const festivalUpdates = updateMessages.map(message => ({
    message,
    admin_id
  }));

  return {
    events,
    festivalUpdates
  };
};

// Usage example in console:
// import { insertSeedData } from '@/utils/insertSeedData';
// insertSeedData('your-admin-user-id');

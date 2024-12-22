const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const router = express.Router();

// Create Event
router.post('/create', async (req, res) => {
    const { title, date, organizationId } = req.body;
    const newEvent = await Event.create({ title, date, organization: organizationId });
    await User.findByIdAndUpdate(organizationId, { $push: { events: newEvent._id } });
    res.status(201).json(newEvent);
});

// Join Event
router.post('/join/:eventId', async (req, res) => {
    const { userId } = req.body;
    const { eventId } = req.params;
    await Event.findByIdAndUpdate(eventId, { $push: { volunteers: userId } });
    await User.findByIdAndUpdate(userId, { $push: { events: eventId } });
    res.status(200).json({ message: 'Joined event successfully' });
});


// Get Events for Volunteer
router.get('/volunteer-events', async (req, res) => {
    const events = await Event.find().populate('organization');
    res.json(events);
});

// Get Events for Organization
router.get('/organization-events/:orgId', async (req, res) => {
    const events = await Event.find({ organization: req.params.orgId }).populate('volunteers');
    res.json(events);
});
router.get('/user-events/:userId', async (req, res) => {
    console.log('Hit');
    try {
        const userId = req.params.userId; // Extract userId from the request parameters
        // Find events where the userId is in the volunteers array
        const events = await Event.find({ volunteers: userId }).populate('volunteers');

        // Check if any events were found
        if (events.length > 0) {
            return res.json(events); // Return the found events
        } else {
            return res.status(404).json({ message: 'No events found for this user' }); // No events found
        }
    } catch (error) {
        console.error('Error fetching user events:', error); // Log the error
        return res.status(500).json({ message: 'Server error' }); // Return a 500 error for server issues
    }
});

router.get('/event-details/:eventId', async (req, res) => {
    const { eventId } = req.params;
    
    try {
        const event = await Event.findById(eventId).populate('volunteers');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Example route for fetching joined events

module.exports = router;
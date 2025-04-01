import express from 'express';
import User from '../models/User';
import Product from '../models/Product';

const router = express.Router();

router.post('/update-location', async (req:any, res:any) => {
    const { userId, location } = req.body;
    if (!userId || !location?.latitude || !location?.longitude) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, {
            location,
            'appUsageStats.lastActiveDate': new Date()
        }, { new: true });

        if (!user) return res.status(404).json({ message: 'User not found' });

        await Product.updateMany({ userId }, {
            latitude: location.latitude,
            longitude: location.longitude
        });

        res.json({ message: 'Location updated', location });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

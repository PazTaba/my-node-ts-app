import express from 'express';
import Jobs from '../models/Jobs';

const router = express.Router();

// GET all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Jobs.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ message: 'שגיאה בטעינת המשרות' });
    }
});

// GET filtered jobs
router.get('/filter', async (req: any, res: any) => {
    try {
        const { interest, type, search, minSalary, maxSalary } = req.query;
        const filter: any = {};

        if (interest && interest !== 'all') filter.interest = interest;
        if (type && type !== 'all') filter.type = type;
        if (search) filter.title = { $regex: search, $options: 'i' };

        const jobs = await Jobs.find(filter);
        const filtered = (minSalary || maxSalary)
            ? jobs.filter(job => {
                const [min, max] = job.salary.split('-').map(s =>
                    parseInt(s.replace(/[^\d]/g, ''), 10)
                );
                if (minSalary && min < parseInt(minSalary)) return false;
                if (maxSalary && max > parseInt(maxSalary)) return false;
                return true;
            })
            : jobs;

        res.json(filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (err) {
        console.error('Error filtering jobs:', err);
        res.status(500).json({ message: 'שגיאה בסינון המשרות' });
    }
});


// GET job by id
router.get('/:id', async (req: any, res: any) => {
    try {
        const job = await Jobs.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'המשרה לא נמצאה' });
        }
        res.json(job);
    } catch (err) {
        console.error('Error fetching job:', err);
        res.status(500).json({ message: 'שגיאה בטעינת המשרה' });
    }
});


// POST new job
router.post('/', async (req: any, res: any) => {
    try {
        const {
            title,
            company,
            type,
            location,
            salary,
            interest,
            description,
            requirements,
            contactEmail,
            contactPhone,
            postedDate
        } = req.body;

        if (!title || !company || !type || !location || !salary || !interest ||
            !description || !requirements || !contactEmail || !contactPhone || !postedDate) {
            return res.status(400).json({ message: 'כל השדות הם חובה' });
        }

        const newJob = new Jobs({
            title,
            company,
            type,
            location,
            salary,
            interest,
            description,
            requirements,
            contactEmail,
            contactPhone,
            postedDate
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error('Error creating job:', err);
        res.status(500).json({ message: 'שגיאה ביצירת המשרה' });
    }
});


// PUT update job
router.put('/:id', async (req: any, res: any) => {
    try {
        const {
            title,
            company,
            type,
            location,
            salary,
            interest,
            description,
            requirements,
            contactEmail,
            contactPhone,
            postedDate
        } = req.body;

        if (!title || !company || !type || !location || !salary || !interest ||
            !description || !requirements || !contactEmail || !contactPhone || !postedDate) {
            return res.status(400).json({ message: 'כל השדות הם חובה' });
        }

        const updatedJob = await Jobs.findByIdAndUpdate(
            req.params.id,
            {
                title,
                company,
                type,
                location,
                salary,
                interest,
                description,
                requirements,
                contactEmail,
                contactPhone,
                postedDate
            },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ message: 'המשרה לא נמצאה' });
        }

        res.json(updatedJob);
    } catch (err) {
        console.error('Error updating job:', err);
        res.status(500).json({ message: 'שגיאה בעדכון המשרה' });
    }
});


// DELETE job
router.delete('/:id', async (req: any, res: any) => {
    try {
        const deleted = await Jobs.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'המשרה לא נמצאה' });
        }
        res.json({ message: 'המשרה נמחקה בהצלחה' });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ message: 'שגיאה במחיקת המשרה' });
    }
});


export default router;


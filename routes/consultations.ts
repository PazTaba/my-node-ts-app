import express from 'express';
import Consultation from '../models/Consultation';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: any, res: any) => {
  const { userId, question, category, description, location, author } = req.body;

  if (!userId || !question || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const consultation = new Consultation({
      userId,
      question,
      category,
      description,
      location,
      author,
      likes: 0,
      answers: [],
      status: 'open'
    });

    await consultation.save();
    res.status(201).json({ message: 'Consultation created', consultation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/answers', async (req: any, res: any) => {
  const { id } = req.params;
  const { text, author } = req.body;

  if (!text || !author) return res.status(400).json({ message: 'Missing fields' });

  try {
    const consultation = await Consultation.findById(id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    const answer = {
      id: new Date().valueOf().toString(),
      text,
      author,
      createdAt: new Date(),
      likes: 0
    };

    consultation.answers.push(answer);
    await consultation.save();

    res.status(201).json({ message: 'Answer added', answer });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:consultationId/answers/:answerId/like', async (req: any, res: any) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    const answer = consultation.answers.find(ans => ans.id === req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    if (answer.likes)
      answer.likes += 1;
    await consultation.save();

    res.json({ message: 'Like added', likes: answer.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

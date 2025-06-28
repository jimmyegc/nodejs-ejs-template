import express from 'express'
import User from '../models/User.js'
import multer from 'multer'
const router = express.Router()

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
  }
})

const upload = multer({
  storage: storage  
}).single("image")

// GET all users
router.get('/', async (req, res) => {
  const users = await User.find().sort({ created_at: -1 })
  res.render('users', { users })
})

// POST new user
router.post('/', upload, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const image = req.file ? req.file.filename : null;

    const user = new User({ name, email, phone, image });

    await user.save(); // <- usa await aquí

    req.session.message = {
      type: 'success',
      message: "User added successfully!"
    };

    res.redirect('/users');
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});

router.get('/add', (req, res) => {
  res.send('add_user', { title: "Add Users" })
})

// GET edit form
router.get('/:id/edit', async (req, res) => {
  const user = await User.findById(req.params.id)
  res.render('edit-user', { user })
})

// POST update user
router.post('/:id', async (req, res) => {
  const { name, email, phone, image } = req.body
  await User.findByIdAndUpdate(req.params.id, { name, email, phone, image })
  res.redirect('/users')
})

// DELETE user
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.redirect('/users')
})

export default router

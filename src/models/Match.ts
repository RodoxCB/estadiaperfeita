import mongoose from 'mongoose'

export interface IMatch {
  _id: string
  userId: mongoose.Schema.Types.ObjectId
  hotelId: mongoose.Schema.Types.ObjectId
  score: number
  status: 'pending' | 'contacted' | 'booked' | 'rejected'
  userLiked: boolean
  hotelLiked: boolean
  createdAt: Date
  updatedAt: Date
}

const MatchSchema = new mongoose.Schema<IMatch>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'booked', 'rejected'],
    default: 'pending',
  },
  userLiked: {
    type: Boolean,
    default: false,
  },
  hotelLiked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Índice composto para evitar matches duplicados
MatchSchema.index({ userId: 1, hotelId: 1 }, { unique: true })

export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema)

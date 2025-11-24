import mongoose from 'mongoose'

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  preferences: {
    groupSize: number
    leisureType: 'beach' | 'mountain' | 'city' | 'countryside' | 'adventure'
    acceptsPets: boolean
    budget: {
      min: number
      max: number
    }
    amenities: string[]
    locationPreferences: string[]
    specialRequirements?: string
  }
  matches: string[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    groupSize: {
      type: Number,
      default: 1,
      min: 1,
      max: 50,
    },
    leisureType: {
      type: String,
      enum: ['beach', 'mountain', 'city', 'countryside', 'adventure'],
      default: 'beach',
    },
    acceptsPets: {
      type: Boolean,
      default: false,
    },
    budget: {
      min: {
        type: Number,
        default: 50,
      },
      max: {
        type: Number,
        default: 1000,
      },
    },
    amenities: [{
      type: String,
      trim: true,
    }],
    locationPreferences: [{
      type: String,
      trim: true,
    }],
    specialRequirements: {
      type: String,
      trim: true,
    },
  },
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  }],
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

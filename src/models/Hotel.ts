import mongoose from 'mongoose'

export interface IHotel {
  _id: string
  ownerId: mongoose.Schema.Types.ObjectId
  name: string
  description: string
  location: {
    city: string
    state: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  images: string[]
  capacity: number
  pricePerNight: number
  amenities: string[]
  leisureType: string[]
  acceptsPets: boolean
  contactInfo: {
    phone: string
    email: string
    whatsapp?: string
  }
  rating: number
  reviews: {
    userId: mongoose.Schema.Types.ObjectId
    rating: number
    comment: string
    createdAt: Date
  }[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const HotelSchema = new mongoose.Schema<IHotel>({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'Brasil',
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  images: [{
    type: String,
  }],
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 1,
  },
  amenities: [{
    type: String,
    trim: true,
  }],
  leisureType: [{
    type: String,
    enum: ['beach', 'mountain', 'city', 'countryside', 'adventure'],
  }],
  acceptsPets: {
    type: Boolean,
    default: false,
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    whatsapp: String,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema)

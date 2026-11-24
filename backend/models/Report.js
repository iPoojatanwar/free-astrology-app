
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportType: {
      type: String,
      enum: ['BIRTH_CHART', 'KUNDLI_MATCHING', 'PANCHANG'],
      required: true,
    },
    inputDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;

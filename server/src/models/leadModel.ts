import { Schema, model, Document } from "mongoose";

export enum LeadStatus {
    New = 'new',
    Contacted = 'contacted',
    Qualified = 'qualified',
    Lost = 'lost'
}

export enum LeadSource {
    Website = 'website',
    Instagram = 'instagram',
    Referral = 'referral',
}

export interface ILead extends Document {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status: LeadStatus;
    source: LeadSource;
    notes?: string;
    value?: number;
    assignedTo?: Schema.Types.ObjectId;
    createdBy: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};

const LeadSchema = new Schema<ILead>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        default: null
    },
    company: {
        type: String,
        default: null
    },
    status: {
        type: String,   
        enum: Object.values(LeadStatus),
        default: LeadStatus.New
    },
    source: {   
        type: String,
        enum: Object.values(LeadSource),
        default: LeadSource.Website
    },
    notes: {
        type: String,
        default: null
    },
    value: {
        type: Number,
        default: 0
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

LeadSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        const document = ret as any;
        document.id = document._id.toString();
        delete document._id;
        return document;
    },
});

LeadSchema.set("toObject", {
    virtuals: true,
});


const Lead = model<ILead>('Lead', LeadSchema);

export default Lead;
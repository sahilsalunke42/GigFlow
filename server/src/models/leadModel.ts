import { Schema, model, Document } from "mongoose";

export enum LeadStatus {
    New = 'new',
    Contacted = 'contacted',
    Qualified = 'qualified',
    Lost = 'lost'
}

export enum LeadSource {
    Website = 'website',
    Referral = 'referral',
    Advertisement = 'advertisement',
    Other = 'other'
}

export interface ILead extends Document {
    name: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    createdBy: Schema.Types.ObjectId;
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
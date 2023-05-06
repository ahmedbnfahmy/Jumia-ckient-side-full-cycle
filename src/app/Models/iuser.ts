export interface Iuser {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    shop?:{
        shopName: { type: String},
        logo: { type: String,},
        description: { type: String}
    }
}

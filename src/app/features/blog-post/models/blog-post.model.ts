import { Category } from "../../category/models/category.model";

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    urlHandle: string;
    shortDescription: string;
    featuredImageURl: string;
    author: string;
    publishedDate: Date;
    isVisible: boolean; 
    categories: Category[];

}
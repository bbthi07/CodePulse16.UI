export interface AddBlogPost{
    title: string;
    content: string;
    urlHandle: string;
    shortDescription: string;
    featuredImageURl: string;
    author: string;
    publishedDate: Date;
    isVisible: boolean; 
    categories: string[];

}
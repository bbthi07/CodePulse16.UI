import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogPost } from '../models/blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { ActivatedRoute, Router, ɵEmptyOutletComponent } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { CategoryService } from '../../category/services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { BrowserModule } from '@angular/platform-browser';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css'],
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
model?: BlogPost;
categories$?: Observable<Category[]>;
selectedCategories?: string[];
isImageSelectorVisible: boolean = false;

routeSubscription?: Subscription | undefined;
getblogPostSubscription?: Subscription | undefined;
updateBlogPostSubscription?: Subscription | undefined;
deleteBlogPostSubscription?: Subscription | undefined;
imageSelectSubscription?: Subscription | undefined;
id: string | null = null;
  constructor(private route: ActivatedRoute, 
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private router: Router) { 

  }

  ngOnInit(): void{
    this.categories$ = this.categoryService.getAllCategories();
    this.routeSubscription = this.route.paramMap.subscribe({
      next: (params) => {
      this.id = params.get('id');
      if(this.id){
        this.getblogPostSubscription =this.blogPostService.getBlogPostById(this.id).subscribe({
          next: (response) => {
            this.model = response;
            this.selectedCategories = response.categories.map(x => x.id);
          }
        });
      }
       
        this.imageSelectSubscription = this.imageService.onSelectImage()
        .subscribe({
          next: (response) =>
          {
            if (this.model)
            {
              this.model.featuredImageURl = response.url;
              this.isImageSelectorVisible = false;
            }
          }
        })
       
      }
    });
  
  }
  onFormSubmit() {
    if (this.model && this.id)
    {
      var updateBlogPost : UpdateBlogPost = {
        title: this.model.title,
        content: this.model.content,
        urlHandle: this.model.urlHandle,
        shortDescription: this.model.shortDescription,
        featuredImageURl: this.model.featuredImageURl,
        author: this.model.author,
        publishedDate: this.model.publishedDate,
        isVisible: this.model.isVisible,
        categories: this.selectedCategories ?? []
      };
      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id, updateBlogPost).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }
  }
  onDelete(){
    if (this.id){
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }
  }
  openImageSelector() : void{
    this.isImageSelectorVisible = true;
  }
  closeImageSelector() : void{
    this.isImageSelectorVisible = false;
  }

 ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.getblogPostSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
 }
}
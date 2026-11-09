import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { Observable, Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  categories$!: Observable<Category[]>;
  isImageSelectorVisible: boolean = false;
  imageSelectSubscription?: Subscription;

  constructor(private blogPostService: BlogPostService, private categoryService: CategoryService,
    private imageService: ImageService, private router: Router
  ) {
    this.model = {
      title: '',
      shortDescription: '',
      content: '',
      featuredImageURl: '',
      urlHandle: '',
      publishedDate: new Date(),
      author: '',
      isVisible: true,
      categories: []
    };
  }

  onFormSubmit() {
    console.log(this.model);
    this.blogPostService.creeateBlogPost(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      },
      
    });
  }
   openImageSelector() : void{
    this.isImageSelectorVisible = true;
  }
  closeImageSelector() : void{
    this.isImageSelectorVisible = false;
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
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
  ngOnDestroy(): void {
    this.imageSelectSubscription?.unsubscribe();
  }
}

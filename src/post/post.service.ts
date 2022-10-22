import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly repository: Repository<Post>,
  ) {}

  async create(data: CreatePostDto) {
    const post = await this.repository.create({
      title: data.title,
      description: data.description,
      author: data.author,
      slug: data.slug,
      published: data.published,
      published_at: data.published_at,
    });

    await this.repository.save(post);

    return post;
  }

  async findAll() {
    const posts = await this.repository.find();

    return posts;
  }

  async findOne(id: number) {
    const post = await this.repository.findOneBy({ id: id });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async update(id: number, data: UpdatePostDto) {
    //Carrega um post, caso exista
    //e adiciona os dados enviados
    const post = await this.repository.preload({
      id,
      ...data,
    });

    if (!post) throw new NotFoundException('Post not found');

    await this.repository.update(id, post);

    return post;
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    return await this.repository.remove(post);
  }
}

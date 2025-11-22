import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GradeEntity } from '../entities/grade.entity';
import { GradeCategoryEntity, AggregationMethod } from '../entities/grade-category.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { CreateGradeDto, UpdateGradeDto, CreateGradeCategoryDto, UpdateGradeCategoryDto } from '../dto/grade.dto';

@Injectable()
export class GradebookService {
  constructor(
    @InjectRepository(GradeEntity) private readonly gradeRepo: Repository<GradeEntity>,
    @InjectRepository(GradeCategoryEntity) private readonly categoryRepo: Repository<GradeCategoryEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
  ) {}

  async listGrades(courseId: string, userId?: string) {
    await this.ensureCourse(courseId);
    const where: any = { courseId };
    if (userId) where.userId = userId;
    return this.gradeRepo.find({
      where,
      relations: ['category', 'gradedBy', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getGrade(id: string) {
    const grade = await this.gradeRepo.findOne({
      where: { id },
      relations: ['category', 'gradedBy', 'user', 'course'],
    });
    if (!grade) throw new NotFoundException('Grade not found');
    return grade;
  }

  async createGrade(dto: CreateGradeDto, gradedById: string) {
    await this.ensureCourse(dto.courseId);
    await this.ensureUser(dto.userId);
    if (dto.categoryId) await this.ensureCategory(dto.courseId, dto.categoryId);

    const grade = this.gradeRepo.create({
      ...dto,
      maxGrade: dto.maxGrade ?? 100,
      gradedById,
      gradedAt: new Date(),
    });
    return this.gradeRepo.save(grade);
  }

  async updateGrade(id: string, dto: UpdateGradeDto) {
    const grade = await this.getGrade(id);
    Object.assign(grade, dto);
    return this.gradeRepo.save(grade);
  }

  async deleteGrade(id: string) {
    const grade = await this.getGrade(id);
    await this.gradeRepo.remove(grade);
    return { success: true };
  }

  async listCategories(courseId: string) {
    await this.ensureCourse(courseId);
    return this.categoryRepo.find({
      where: { courseId },
      order: { itemOrder: 'ASC' },
    });
  }

  async createCategory(dto: CreateGradeCategoryDto) {
    await this.ensureCourse(dto.courseId);
    const maxOrder = await this.categoryRepo
      .createQueryBuilder('cat')
      .where('cat.courseId = :courseId', { courseId: dto.courseId })
      .select('MAX(cat.itemOrder)', 'max')
      .getRawOne<{ max: number | null }>();

    const category = this.categoryRepo.create({
      ...dto,
      weight: dto.weight ?? 0,
      aggregationMethod: dto.aggregationMethod ?? 'mean',
      itemOrder: (maxOrder?.max ?? 0) + 1,
    });
    return this.categoryRepo.save(category);
  }

  async updateCategory(id: string, dto: UpdateGradeCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepo.remove(category);
    return { success: true };
  }

  async calculateFinalGrade(courseId: string, userId: string) {
    await this.ensureCourse(courseId);
    await this.ensureUser(userId);

    const categories = await this.listCategories(courseId);
    const grades = await this.gradeRepo.find({
      where: { courseId, userId, isDropped: false, isExcused: false },
      relations: ['category'],
    });

    if (categories.length === 0) {
      const total = grades.reduce((sum, g) => sum + Number(g.grade), 0);
      const maxTotal = grades.reduce((sum, g) => sum + Number(g.maxGrade), 0);
      return { finalGrade: maxTotal > 0 ? (total / maxTotal) * 100 : 0, breakdown: [] };
    }

    const breakdown: Array<{ categoryId?: string; categoryName?: string; grade: number; weight: number }> = [];
    let weightedSum = 0;
    let totalWeight = 0;

    for (const category of categories) {
      const categoryGrades = grades.filter((g) => g.categoryId === category.id);
      if (categoryGrades.length === 0) continue;

      let categoryGrade = this.aggregateGrades(categoryGrades, category.aggregationMethod);
      const weight = Number(category.weight);
      weightedSum += categoryGrade * weight;
      totalWeight += weight;

      breakdown.push({
        categoryId: category.id,
        categoryName: category.name,
        grade: categoryGrade,
        weight,
      });
    }

    const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return { finalGrade, breakdown };
  }

  private aggregateGrades(grades: GradeEntity[], method: AggregationMethod): number {
    const values = grades.map((g) => Number(g.grade) / Number(g.maxGrade) * 100);
    if (values.length === 0) return 0;

    switch (method) {
      case 'mean':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'max':
        return Math.max(...values);
      case 'min':
        return Math.min(...values);
      case 'median':
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      default:
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
  }

  private async ensureCourse(courseId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  private async ensureUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async ensureCategory(courseId: string, categoryId: string) {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId, courseId } });
    if (!category) throw new BadRequestException('Category not found in this course');
    return category;
  }
}

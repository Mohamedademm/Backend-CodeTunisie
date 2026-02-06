require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Question = require('../models/Question');

const seedClassCE = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // 1. Create Course
        const courseData = {
            title: 'رخصة السياقة صنف ج+ه (C+E)',
            description: 'دورة شاملة للحصول على رخصة السياقة صنف ج+ه (شاحنة ثقيلة مع مقطورة).',
            content: `
                <div class="space-y-8 text-right text-right-rtl" dir="rtl">
                    <!-- Intro -->
                    <div class="bg-card glass-effect p-6 rounded-xl border border-border shadow-sm">
                        <h2 class="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                             <span class="bg-primary/10 p-2 rounded-lg"><i class="lucide-truck w-6 h-6"></i></span>
                            رخصة السياقة صنف "ج+ه" (C+E)
                        </h2>
                        <p class="text-muted-foreground leading-relaxed text-lg">
                            رخصة السياقة صنف "ج" (C) صالحة لسياقة العربات المعدة لنقل البضائع والتي يفوق وزنها الجملي المرخص فيه 3.5 طن.
                            <br>
                            رخصة السياقة صنف "ج+ه" (C+E) صالحة لسياقة العربات التي يفوق وزنها 3.5 طن وتقرن بها مجرورة أو نصف مجرورة يتجاوز وزنها 750 كغ.
                        </p>
                    </div>

                    <!-- Section 1 -->
                    <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-border shadow-sm">
                        <h3 class="text-xl font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                            <span class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold">1</span>
                            خصائص الوزن والطول (الأبعاد القصوى)
                        </h3>
                        <div class="space-y-4">
                            <div class="grid md:grid-cols-2 gap-4">
                                <div class="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                    <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-2">العربة المنفردة</h4>
                                    <ul class="space-y-2 text-sm text-foreground/80">
                                        <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>أقصى طول: <strong>12 متر</strong></li>
                                        <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>أقصى وزن (2 مغازل): <strong>18 طن</strong></li>
                                        <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>أقصى وزن (3 مغازل): <strong>26 طن</strong></li>
                                        <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>أقصى وزن (4 مغازل): <strong>32 طن</strong></li>
                                    </ul>
                                </div>
                                <div class="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                                    <h4 class="font-bold text-green-700 dark:text-green-300 mb-2">العربة المركبة (جرار + نصف مجرورة)</h4>
                                    <ul class="space-y-2 text-sm text-foreground/80">
                                        <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>أقصى طول: <strong>16.50 متر</strong></li>
                                        <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>أقصى وزن (4 مغازل): <strong>38 طن</strong></li>
                                        <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>أقصى وزن (5 مغازل): <strong>40 طن</strong></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                                <h4 class="font-bold text-purple-700 dark:text-purple-300 mb-2">مجموعة عربات (شاحنة + مجرورة)</h4>
                                <ul class="space-y-2 text-sm text-foreground/80">
                                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-purple-500"></div>أقصى طول: <strong>18.75 متر</strong></li>
                                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-purple-500"></div>أقصى وزن (5 مغازل فأكثر): <strong>40 طن</strong></li>
                                </ul>
                            </div>
                        </div>
                        <div class="mt-4">
                             <img src="/assets/images/courses/ce/S1.jpeg" alt="الأبعاد والأوزان" class="w-full h-auto rounded-lg border border-border shadow-sm hover:ring-2 ring-primary transition-all cursor-zoom-in" />
                        </div>
                    </div>

                    <!-- Section 2 -->
                    <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-border shadow-sm">
                        <h3 class="text-xl font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                             <span class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold">2</span>
                            المجرورة والإضاءة
                        </h3>
                        <p class="text-muted-foreground mb-4 text-lg">
                            • أقصى عرض للشاحنة: <strong>2.55 متر</strong> (2.60 متر لعربات التبريد).
                            <br>
                            • أقصى ارتفاع: <strong>4 أمتار</strong> (باعتبار الحمولة).
                        </p>
                        <div class="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50 mb-4">
                            <h4 class="font-bold text-amber-700 dark:text-amber-300 mb-2">الأضواء وتجهيزات الرؤية</h4>
                            <ul class="space-y-2 text-sm text-foreground/80">
                                <li class="flex items-start gap-2">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                                    <span>يجب تجهيز الشاحنة بأضواء الحجم (Feux de gabarit) إذا تجاوز العرض <strong>2.10 متر</strong>.</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                                    <span>يجب أن تكون هذه الأضواء مرئية من الأمام (أبيض/أصفر) ومن الخلف (أحمر).</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                                    <span>يجب تجهيز الشاحنة بأضواء عاكسة جانبية إذا تجاوز الطول <strong>6 أمتار</strong>.</span>
                                </li>
                            </ul>
                        </div>
                         <div class="mt-4">
                             <img src="/assets/images/courses/ce/S2.jpeg" alt="الإضاءة والمجرورة" class="w-full h-auto rounded-lg border border-border shadow-sm hover:ring-2 ring-primary transition-all cursor-zoom-in" />
                        </div>
                    </div>

                    <!-- Section 3 -->
                    <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-border shadow-sm">
                        <h3 class="text-xl font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                            <span class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold">3</span>
                            السرعة والسلامة
                        </h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                 <h4 class="font-bold text-foreground mb-3 flex items-center gap-2"><i class="lucide-gauge w-4 h-4"></i> تحديد السرعة</h4>
                                 <div class="overflow-hidden rounded-lg border border-border">
                                     <table class="w-full text-sm text-right">
                                        <thead class="bg-muted">
                                            <tr>
                                                <th class="p-3 font-semibold text-muted-foreground">الوزن الجملي</th>
                                                <th class="p-3 font-semibold text-muted-foreground">طرقات عادية</th>
                                                <th class="p-3 font-semibold text-muted-foreground">طريق سيارة</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-border bg-card">
                                            <tr>
                                                <td class="p-3">3.5 - 12 طن</td>
                                                <td class="p-3 font-medium">80 كم/س</td>
                                                <td class="p-3 font-bold text-primary">100 كم/س</td>
                                            </tr>
                                            <tr>
                                                <td class="p-3">12 - 19 طن</td>
                                                <td class="p-3 font-medium">70 كم/س</td>
                                                <td class="p-3 font-bold text-primary">90 كم/س</td>
                                            </tr>
                                             <tr>
                                                <td class="p-3">&gt; 19 طن</td>
                                                <td class="p-3 font-medium">60 كم/س</td>
                                                <td class="p-3 font-bold text-primary">80 كم/س</td>
                                            </tr>
                                        </tbody>
                                     </table>
                                 </div>
                            </div>
                            <div>
                                 <h4 class="font-bold text-foreground mb-3 flex items-center gap-2"><i class="lucide-shield-check w-4 h-4"></i> قواعد السلامة</h4>
                                 <div class="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-100 dark:border-red-900/50 space-y-3">
                                    <div class="flex gap-3">
                                        <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 flex items-center justify-center flex-shrink-0 font-bold">50</div>
                                        <div>
                                            <p class="font-bold text-red-800 dark:text-red-300">مسافة الأمان</p>
                                            <p class="text-sm text-foreground/80">يجب ترك مسافة لا تقل عن 50 متر عند السير خارج مواطن العمران للعربات > 3.5 طن.</p>
                                        </div>
                                    </div>
                                    <div class="flex gap-3">
                                        <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 flex items-center justify-center flex-shrink-0"><i class="lucide-clock w-4 h-4"></i></div>
                                        <div>
                                            <p class="font-bold text-red-800 dark:text-red-300">أوقات الراحة</p>
                                            <p class="text-sm text-foreground/80">راحة إجبارية لمدة 45 دقيقة بعد كل 4.5 ساعات سياقة.</p>
                                        </div>
                                    </div>
                                 </div>
                            </div>
                        </div>
                        <div class="mt-4">
                             <img src="/assets/images/courses/ce/S3.jpeg" alt="السرعة والسلامة" class="w-full h-auto rounded-lg border border-border shadow-sm hover:ring-2 ring-primary transition-all cursor-zoom-in" />
                        </div>
                    </div>

                    <!-- Section 4 -->
                     <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-border shadow-sm">
                        <h3 class="text-xl font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                            <span class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold">4</span>
                            الوثائق والعلامات المميزة
                        </h3>
                        <div class="mb-6">
                            <h4 class="font-bold text-foreground mb-3">الأقراص المميزة (Disques)</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/50">
                                    <div class="w-6 h-6 rounded-full bg-green-500 shadow-sm border-2 border-white dark:border-green-800"></div>
                                     <span class="text-sm font-medium">أخضر: نقل خاص</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                                    <div class="w-6 h-6 rounded-full bg-red-500 shadow-sm border-2 border-white dark:border-red-800"></div>
                                     <span class="text-sm font-medium">أحمر: نقل لحساب الغير</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                    <div class="w-6 h-6 rounded-full bg-blue-500 shadow-sm border-2 border-white dark:border-blue-800"></div>
                                     <span class="text-sm font-medium">أزرق: نقل دولي</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                             <h4 class="font-bold text-destructive mb-2 flex items-center gap-2"><i class="lucide-alert-triangle w-4 h-4"></i> المخالفات والعقوبات</h4>
                             <ul class="space-y-2 text-sm text-foreground/80">
                                <li class="flex items-start gap-2">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0"></span>
                                    <span>عدم وجود بطاقة استغلال لشاحنة > 12 طن: <strong class="text-destructive">خطية 500 دينار</strong>.</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0"></span>
                                    <span>عدم وضع ملصقات الخطر لنقل المواد الخطرة: <strong class="text-destructive">خطية 1000 دينار</strong>.</span>
                                </li>
                             </ul>
                        </div>
                        <div class="mt-4">
                             <img src="/assets/images/courses/ce/S4.jpeg" alt="الوثائق" class="w-full h-auto rounded-lg border border-border shadow-sm hover:ring-2 ring-primary transition-all cursor-zoom-in" />
                        </div>
                    </div>
                </div>
            `,
            category: 'poids-lourd',
            difficulty: 'difficile',
            duration: '4h',
            lessons: 4,
            icon: 'truck',
            isPublished: true,
            isPremium: false
        };

        // Check if course exists
        let course = await Course.findOne({ title: courseData.title });
        if (course) {
            console.log('Updating existing course...');
            Object.assign(course, courseData);
            await course.save();
        } else {
            console.log('Creating new course...');
            course = await Course.create(courseData);
        }

        // 2. Create Questions (in Arabic)
        const questionsData = [
            {
                question: 'ما هو الحد الأقصى للطول المسموح به لمجموعة مركبات (جرار + مقطورة)؟',
                options: ['16.50 متر', '18.75 متر', '15.50 متر', '20.00 متر'],
                correctAnswer: 0,
                explanation: 'الحد الأقصى لطول العربة المترابطة (جرار + نصف مقطورة) هو 16.50 متر.',
                category: 'poids-lourd',
                difficulty: 'moyen'
            },
            {
                question: 'عند ربط المقطورة، ما هو أول شيء يجب القيام به؟',
                options: ['توصيل الخراطيم الهوائية', 'رفع الأرجل الداعمة', 'التأكد من تطابق ارتفاع السرج مع المسمار', 'توصيل الكهرباء'],
                correctAnswer: 2,
                explanation: 'قبل الرجوع للخلف للربط، يجب التأكد من أن ارتفاع سرج الجرار ومسمار المقطورة متناسبان.',
                category: 'poids-lourd',
                difficulty: 'difficile'
            },
            {
                question: 'ما هي السرعة القصوى المسموح بها للشاحنات الثقيلة خارج مناطق العمران في الطرق السيارة؟',
                options: ['70 كم/س', '80 كم/س', '90 كم/س', '110 كم/س'],
                correctAnswer: 1,
                explanation: 'السرعة محددة بـ 80 كم/س للشاحنات الثقيلة في الطرق السيارة.',
                category: 'poids-lourd',
                difficulty: 'moyen'
            },
            {
                question: 'ما هو الوزن الإجمالي المسموح به لمركبة بمحورين؟',
                options: ['19 طن', '26 طن', '32 طن', '40 طن'],
                correctAnswer: 0,
                explanation: 'الوزن الأقصى لمركبة معزولة بمحورين هو 19 طن.',
                category: 'poids-lourd',
                difficulty: 'difficile'
            },
            {
                question: 'عند الانعطاف لليمين بشاحنة ومقطورة، كيف يجب أن تتصرف؟',
                options: ['الاقتراب جداً من الرصيف', 'توسيع الدورة لتجنب صعود المقطورة على الرصيف', 'السرعة الزائدة', 'استعمال المنبه الصوتي'],
                correctAnswer: 1,
                explanation: 'يجب توسيع الدورة (Braquage large) لأن عجلات المقطورة الخلفية تمر في مسار أضيق من الجرار.',
                category: 'poids-lourd',
                difficulty: 'facile'
            },
            {
                question: 'ما وظيفة جهاز "التاكوجراف" في الشاحنة؟',
                options: ['تسجيل السرعة وأوقات القيادة والراحة', 'قياس ضغط العجلات', 'تحديد الموقع GPS', 'قياس استهلاك الوقود'],
                correctAnswer: 0,
                explanation: 'يسجل التاكوجراف (Chronotachygraphe) السرعة ووقت القيادة وفترات الراحة للسائق.',
                category: 'poids-lourd',
                difficulty: 'facile'
            },
            {
                question: 'ما هو الطول الأقصى المسموح به لعربة منفردة؟',
                options: ['11 متر', '12 متر', '10 أمتار', '14 متر'],
                correctAnswer: 1,
                explanation: 'الطول الأقصى لعربة منفردة هو 12 متر.',
                category: 'poids-lourd',
                difficulty: 'facile'
            },
            {
                question: 'ما هو الوزن الجملي المرخص فيه لعربة بـ 3 مغازل (essieux)؟',
                options: ['20 طن', '26 طن', '30 طن', '24 طن'],
                correctAnswer: 1,
                explanation: 'الوزن الأقصى المسموح به لعربة منفردة بـ 3 مغازل هو 26 طن.',
                category: 'poids-lourd',
                difficulty: 'moyen'
            },
            {
                question: 'ما هو الطول الأقصى لمجموعة عربات (شاحنة + مقطورة)؟',
                options: ['16.50 متر', '18.75 متر', '18.00 متر', '20.00 متر'],
                correctAnswer: 1,
                explanation: 'الطول الأقصى لمجموعة العربات (Train routier) هو 18.75 متر.',
                category: 'poids-lourd',
                difficulty: 'difficile'
            },
            {
                question: 'رخصة السياقة "ج+ه" (C+E) ضرورية عندما يتجاوز وزن المقطورة:',
                options: ['500 كغ', '750 كغ', '1000 كغ', '3500 كغ'],
                correctAnswer: 1,
                explanation: 'تكون رخصة "ج+ه" ضرورية إذا كان وزن المقطورة يتجاوز 750 كغ.',
                category: 'poids-lourd',
                difficulty: 'facile'
            },
            {
                question: 'ما هو الوزن الأقصى المسموح به لعربة مركبة (جرار + نصف مقطورة) بـ 5 مغازل؟',
                options: ['38 طن', '40 طن', '44 طن', '36 طن'],
                correctAnswer: 1,
                explanation: 'الوزن الأقصى المسموح به لعربة مركبة بـ 5 مغازل هو 40 طن.',
                category: 'poids-lourd',
                difficulty: 'difficile'
            },
            {
                question: 'ما هو الطول الأقصى للعربة المركبة (جرار + نصف مقطورة)؟',
                options: ['15.50 متر', '16.50 متر', '18.75 متر', '12 متر'],
                correctAnswer: 1,
                explanation: 'الطول الأقصى للعربة المركبة هو 16.50 متر.',
                category: 'poids-lourd',
                difficulty: 'moyen'
            },
            // Questions from S2.jpeg (Dimensions & Lights)
            {
                question: 'ما هو الارتفاع الأقصى المسموح به للشاحنات (بما في ذلك الحمولة)؟',
                options: ['3.5 متر', '4.0 متر', '4.5 متر', '5.0 متر'],
                correctAnswer: 1,
                explanation: 'أقصى ارتفاع للشاحنة هو 4 أمتار باعتبار الحمولة.',
                category: 'poids-lourd',
                difficulty: 'facile'
            },
            {
                question: 'متى يجب تجهيز الشاحنة بأضواء الحجم (Des feux de gabarit)؟',
                options: ['إذا تجاوز العرض 2.10 متر', 'إذا تجاوز العرض 2.55 متر', 'إذا تجاوز الطول 6 متر', 'دائماً'],
                correctAnswer: 0,
                explanation: 'يجب تجهيز الشاحنة بأضواء الحجم إذا تجاوز عرضها 2.10 متر.',
                category: 'poids-lourd',
                difficulty: 'moyen'
            },
            // Questions from S3.jpeg (Speed & Safety)
            {
                question: 'ما هي مسافة الأمان الدنيا التي يجب تركها خارج مواطن العمران للعربات التي يتجاوز وزنها 3.5 طن؟',
                options: ['30 متر', '50 متر', '70 متر', '100 متر'],
                correctAnswer: 1,
                explanation: 'يجب ترك مسافة أمان لا تقل عن 50 متر عند السير خارج مواطن العمران.',
                category: 'poids-lourd',
                difficulty: 'moyen'
            },
            {
                question: 'ما هي مدة الاستراحة الإجبارية بعد 4 ساعات ونصف من السياقة المتواصلة؟',
                options: ['15 دقيقة', '30 دقيقة', '45 دقيقة', 'ساعة واحدة'],
                correctAnswer: 2,
                explanation: 'يجب التوقف للاستراحة لمدة 45 دقيقة على الأقل (يمكن تقسيمها إلى 15 ثم 30 دقيقة).',
                category: 'poids-lourd',
                difficulty: 'facile'
            },
            {
                question: 'بالنسبة لشاحنة وزنها 15 طن، ما هي السرعة القصوى المسموح بها في الطرقات العادية (خارج مناطق العمران)؟',
                options: ['60 كم/س', '70 كم/س', '80 كم/س', '90 كم/س'],
                correctAnswer: 1,
                explanation: 'للوزن بين 12 و 19 طن، السرعة محددة بـ 70 كم/س في الطرقات العادية و 90 كم/س في الطرق السيارة.',
                category: 'poids-lourd',
                difficulty: 'difficile'
            },
            // Questions from S4.jpeg (Cards & Plates)
            {
                question: 'ماذا يعني القرص "الأحمر" خلف الشاحنة؟',
                options: ['نقل خاص', 'نقل لحساب الغير (عمومي)', 'نقل دولي', 'نقل مواد خطرة'],
                correctAnswer: 1,
                explanation: 'القرص الأحمر يشير إلى النقل الداخلي لحساب الغير (لحساب الحريف).',
                category: 'poids-lourd',
                difficulty: 'moyen'
            },
            {
                question: 'ماذا يعني القرص "الأخضر" خلف الشاحنة؟',
                options: ['نقل خاص', 'نقل لحساب الغير', 'نقل فلاحي', 'نقل سياحي'],
                correctAnswer: 0,
                explanation: 'القرص الأخضر يشير إلى النقل الخاص.',
                category: 'poids-lourd',
                difficulty: 'facile'
            },
            {
                question: 'ما هي العقوبة المالية لعدم وجود "بطاقة الاستغلال" لشاحنة يتجاوز وزنها 12 طن؟',
                options: ['100 دينار', '300 دينار', '500 دينار', '1000 دينار'],
                correctAnswer: 2,
                explanation: 'ينجر عن عدم وجود بطاقة استغلال خطية مالية قدرها 500 دينار (نقل استثنائي بدون ترخيص/بدون بطاقة).',
                category: 'poids-lourd',
                difficulty: 'difficile'
            }
        ];

        console.log('Seeding questions...');
        for (const q of questionsData) {
            // Avoid duplicates based on question text
            await Question.findOneAndUpdate(
                { question: q.question },
                q,
                { upsert: true, new: true }
            );
        }

        console.log('Successfully seeded Class C+E content!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
};

seedClassCE();

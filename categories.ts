export interface SubcategoryItem {
  name: string
  priceMin?: number
  priceMax?: number
}

export interface CategoryDetail {
  id: number
  icon: string
  name: string
  color: string
  sections: {
    name: string
    items: SubcategoryItem[]
  }[]
}

export const CATEGORIES_DETAIL: CategoryDetail[] = [
  {
    id: 1, icon: '📚', name: 'التعليم والتدريب', color: '#6C63FF',
    sections: [
      { name: 'التعليم العام', items: [
        { name: 'سنة أولى ابتدائي', priceMin: 500, priceMax: 1000 },
        { name: 'سنة ثانية ابتدائي', priceMin: 500, priceMax: 1000 },
        { name: 'سنة ثالثة ابتدائي', priceMin: 500, priceMax: 1000 },
        { name: 'سنة رابعة ابتدائي', priceMin: 500, priceMax: 1000 },
        { name: 'سنة خامسة ابتدائي', priceMin: 500, priceMax: 1000 },
        { name: 'تحضير شهادة الابتدائي', priceMin: 800, priceMax: 1500 },
        { name: 'سنة أولى متوسط', priceMin: 700, priceMax: 1200 },
        { name: 'سنة ثانية متوسط', priceMin: 700, priceMax: 1200 },
        { name: 'سنة ثالثة متوسط', priceMin: 800, priceMax: 1500 },
        { name: 'تحضير شهادة BEM', priceMin: 1000, priceMax: 2000 },
        { name: 'سنة أولى ثانوي', priceMin: 1000, priceMax: 2000 },
        { name: 'سنة ثانية ثانوي', priceMin: 1000, priceMax: 2500 },
        { name: 'تحضير بكالوريا علوم تجريبية', priceMin: 1500, priceMax: 3000 },
        { name: 'تحضير بكالوريا رياضيات', priceMin: 1500, priceMax: 3000 },
        { name: 'تحضير بكالوريا تسيير واقتصاد', priceMin: 1500, priceMax: 3000 },
        { name: 'تحضير بكالوريا لغات', priceMin: 1500, priceMax: 3000 },
        { name: 'دروس جامعية L1/L2/L3', priceMin: 2000, priceMax: 5000 },
        { name: 'مساعدة في الأطروحات والبحوث', priceMin: 5000, priceMax: 20000 },
      ]},
      { name: 'تعليم اللغات', items: [
        { name: 'فرنسية - محادثة وقواعد', priceMin: 1000, priceMax: 2000 },
        { name: 'تحضير DELF/DALF', priceMin: 1500, priceMax: 3000 },
        { name: 'إنجليزية - محادثة وقواعد', priceMin: 1000, priceMax: 2500 },
        { name: 'تحضير IELTS/TOEFL', priceMin: 2000, priceMax: 4000 },
        { name: 'إسبانية - مستوى مبتدئ ومتوسط', priceMin: 1000, priceMax: 2000 },
        { name: 'ألمانية وتحضير Goethe', priceMin: 1000, priceMax: 2500 },
        { name: 'تركية', priceMin: 800, priceMax: 1500 },
        { name: 'صينية (Mandarin) وتحضير HSK', priceMin: 1500, priceMax: 3000 },
        { name: 'أمازيغية (تاقبايليت، تاشلحيت)', priceMin: 500, priceMax: 1500 },
      ]},
      { name: 'تعليم ديني', items: [
        { name: 'تحفيظ القرآن للأطفال', priceMin: 3000, priceMax: 5000 },
        { name: 'تحفيظ القرآن للكبار', priceMin: 5000, priceMax: 8000 },
        { name: 'تجويد وتصحيح النطق', priceMin: 2000, priceMax: 5000 },
        { name: 'فقه وعقيدة', priceMin: 3000, priceMax: 8000 },
        { name: 'سيرة نبوية', priceMin: 2000, priceMax: 5000 },
      ]},
      { name: 'تعليم تقني', items: [
        { name: 'Microsoft Office', priceMin: 5000, priceMax: 15000 },
        { name: 'تصميم جرافيك', priceMin: 10000, priceMax: 30000 },
        { name: 'برمجة Python', priceMin: 15000, priceMax: 35000 },
        { name: 'تطوير ويب HTML/CSS/JS', priceMin: 10000, priceMax: 30000 },
        { name: 'React / Node.js', priceMin: 20000, priceMax: 50000 },
      ]},
    ],
  },
  {
    id: 2, icon: '🔧', name: 'خدمات المنزل والصيانة', color: '#FF6B6B',
    sections: [
      { name: 'كهرباء', items: [
        { name: 'تمديد كهربائي كامل', priceMin: 5000, priceMax: 30000 },
        { name: 'تركيب لوحة كهربائية', priceMin: 3000, priceMax: 10000 },
        { name: 'إصلاح أعطال كهربائية', priceMin: 1000, priceMax: 5000 },
        { name: 'تركيب مكيفات', priceMin: 2000, priceMax: 6000 },
        { name: 'تركيب سخانات كهربائية', priceMin: 1500, priceMax: 4000 },
      ]},
      { name: 'سباكة', items: [
        { name: 'تمديد قنوات المياه', priceMin: 3000, priceMax: 20000 },
        { name: 'إصلاح تسربات المياه', priceMin: 1000, priceMax: 5000 },
        { name: 'تركيب حمامات وسباكة صحية', priceMin: 5000, priceMax: 25000 },
        { name: 'تنظيف مجاري وقنوات الصرف', priceMin: 2000, priceMax: 8000 },
      ]},
      { name: 'دهان وطلاء', items: [
        { name: 'دهان داخلي للغرف', priceMin: 1500, priceMax: 5000 },
        { name: 'دهان خارجي', priceMin: 5000, priceMax: 30000 },
        { name: 'رسم جداريات ديكورية', priceMin: 3000, priceMax: 15000 },
        { name: 'بلاستيك وتنعيم', priceMin: 2000, priceMax: 8000 },
      ]},
      { name: 'بناء وهندسة', items: [
        { name: 'مقاولة بناء', priceMin: 20000, priceMax: 500000 },
        { name: 'فرشاء وبلاط', priceMin: 3000, priceMax: 15000 },
        { name: 'عزل حراري وصوتي', priceMin: 5000, priceMax: 30000 },
        { name: 'جبس وديكور سقف', priceMin: 3000, priceMax: 20000 },
      ]},
    ],
  },
  {
    id: 3, icon: '🚗', name: 'النقل والمواصلات', color: '#00D9A5',
    sections: [
      { name: 'نقل بضائع', items: [
        { name: 'نقل بضائع صغيرة (break/fourgon)', priceMin: 1000, priceMax: 5000 },
        { name: 'نقل بضائع كبيرة (camion)', priceMin: 5000, priceMax: 30000 },
        { name: 'نقل أثاث', priceMin: 3000, priceMax: 15000 },
      ]},
      { name: 'نقل أشخاص', items: [
        { name: 'سيارة أجرة (Taxi)', priceMin: 200, priceMax: 2000 },
        { name: 'VTC (سيارة بالطلب)', priceMin: 300, priceMax: 3000 },
        { name: 'حافلة صغيرة للرحلات', priceMin: 5000, priceMax: 20000 },
      ]},
    ],
  },
  {
    id: 4, icon: '💇', name: 'الصحة والجمال', color: '#FFD700',
    sections: [
      { name: 'حلاقة رجالية', items: [
        { name: 'حلاقة كلاسيكية', priceMin: 200, priceMax: 600 },
        { name: 'حلاقة + لحية', priceMin: 400, priceMax: 1000 },
        { name: 'تصفيف شعر عصري', priceMin: 500, priceMax: 1500 },
      ]},
      { name: 'تجميل نسائي', items: [
        { name: 'قص وتصفيف الشعر', priceMin: 500, priceMax: 3000 },
        { name: 'صبغة شعر', priceMin: 2000, priceMax: 8000 },
        { name: 'مكياج عرائس', priceMin: 5000, priceMax: 20000 },
        { name: 'عناية بالبشرة (facial)', priceMin: 2000, priceMax: 8000 },
        { name: 'مناكير وباديكير', priceMin: 500, priceMax: 2000 },
        { name: 'إزالة شعر', priceMin: 500, priceMax: 3000 },
      ]},
      { name: 'مساج وعلاج', items: [
        { name: 'مساج استرخائي', priceMin: 2000, priceMax: 6000 },
        { name: 'مساج علاجي', priceMin: 3000, priceMax: 10000 },
        { name: 'العلاج بالحجامة', priceMin: 2000, priceMax: 5000 },
      ]},
    ],
  },
  {
    id: 5, icon: '💻', name: 'الخدمات الرقمية والإبداعية', color: '#FF9F43',
    sections: [
      { name: 'تصميم جرافيك', items: [
        { name: 'تصميم شعار (Logo)', priceMin: 2000, priceMax: 15000 },
        { name: 'تصميم بطاقات أعمال', priceMin: 500, priceMax: 3000 },
        { name: 'تصميم إعلانات ومنشورات', priceMin: 500, priceMax: 5000 },
        { name: 'هوية بصرية كاملة', priceMin: 10000, priceMax: 50000 },
      ]},
      { name: 'تطوير ويب وتطبيقات', items: [
        { name: 'موقع WordPress', priceMin: 15000, priceMax: 60000 },
        { name: 'موقع مخصص (React/Vue)', priceMin: 30000, priceMax: 150000 },
        { name: 'تطبيق موبايل', priceMin: 50000, priceMax: 300000 },
        { name: 'متجر إلكتروني', priceMin: 20000, priceMax: 100000 },
      ]},
      { name: 'تصوير ومونتاج', items: [
        { name: 'تصوير فوتوغرافي احترافي', priceMin: 5000, priceMax: 30000 },
        { name: 'تصوير مناسبات', priceMin: 8000, priceMax: 50000 },
        { name: 'مونتاج فيديو', priceMin: 3000, priceMax: 30000 },
        { name: 'موشن جرافيك', priceMin: 5000, priceMax: 40000 },
      ]},
      { name: 'سوشيال ميديا وتسويق', items: [
        { name: 'إدارة صفحات التواصل', priceMin: 5000, priceMax: 20000 },
        { name: 'إعلانات Google/Meta', priceMin: 3000, priceMax: 15000 },
        { name: 'كتابة محتوى', priceMin: 1000, priceMax: 8000 },
      ]},
    ],
  },
  { id: 6, icon: '🎪', name: 'المناسبات والحفلات', color: '#EE5A24', sections: [
    { name: 'تنظيم الأعراس', items: [
      { name: 'تنظيم حفل زفاف كامل', priceMin: 50000, priceMax: 500000 },
      { name: 'ديكور وتزيين قاعة', priceMin: 10000, priceMax: 80000 },
      { name: 'طبخ ولوازم المائدة', priceMin: 20000, priceMax: 200000 },
    ]},
    { name: 'فعاليات أخرى', items: [
      { name: 'تنظيم حفلات أعياد ميلاد', priceMin: 5000, priceMax: 30000 },
      { name: 'تنظيم تخرجات', priceMin: 10000, priceMax: 60000 },
      { name: 'تأجير معدات الصوت والصورة', priceMin: 5000, priceMax: 40000 },
    ]},
  ]},
  { id: 7, icon: '🏠', name: 'العقارات والخدمات العقارية', color: '#0984E3', sections: [
    { name: 'بيع وشراء', items: [
      { name: 'وساطة بيع عقارات', priceMin: 10000, priceMax: 50000 },
      { name: 'تثمين العقارات', priceMin: 3000, priceMax: 15000 },
    ]},
    { name: 'إيجار', items: [
      { name: 'إيجار شقق وفيلات', priceMin: 1000, priceMax: 5000 },
      { name: 'إدارة العقارات', priceMin: 5000, priceMax: 20000 },
    ]},
  ]},
  { id: 8, icon: '🛒', name: 'التجارة والتسويق', color: '#6C5CE7', sections: [
    { name: 'تجارة', items: [
      { name: 'وساطة تجارية', priceMin: 2000, priceMax: 20000 },
      { name: 'استيراد وتصدير', priceMin: 5000, priceMax: 50000 },
    ]},
    { name: 'تسويق', items: [
      { name: 'ترويج منتجات', priceMin: 2000, priceMax: 15000 },
      { name: 'دراسة سوق', priceMin: 10000, priceMax: 50000 },
    ]},
  ]},
  { id: 9, icon: '🔩', name: 'خدمات السيارات', color: '#A29BFE', sections: [
    { name: 'ميكانيك', items: [
      { name: 'صيانة دورية', priceMin: 2000, priceMax: 8000 },
      { name: 'إصلاح محرك', priceMin: 5000, priceMax: 50000 },
      { name: 'تغيير زيت وفلاتر', priceMin: 1000, priceMax: 3000 },
    ]},
    { name: 'كاروسري وطلاء', items: [
      { name: 'إصلاح هياكل', priceMin: 5000, priceMax: 30000 },
      { name: 'طلاء سيارات', priceMin: 10000, priceMax: 50000 },
    ]},
    { name: 'كهرباء سيارات', items: [
      { name: 'تشخيص إلكتروني', priceMin: 1000, priceMax: 4000 },
      { name: 'إصلاح شبكة كهربائية', priceMin: 2000, priceMax: 15000 },
    ]},
  ]},
  { id: 10, icon: '🏥', name: 'الخدمات الطبية والصحية', color: '#00B894', sections: [
    { name: 'طب عام', items: [
      { name: 'استشارة طبية عامة', priceMin: 1000, priceMax: 3000 },
      { name: 'تمريض منزلي', priceMin: 2000, priceMax: 8000 },
    ]},
    { name: 'أسنان', items: [
      { name: 'تنظيف وتبييض أسنان', priceMin: 2000, priceMax: 8000 },
      { name: 'حشو وخلع', priceMin: 3000, priceMax: 15000 },
      { name: 'تركيب تقويم أسنان', priceMin: 30000, priceMax: 150000 },
    ]},
    { name: 'كينيزتيرابي', items: [
      { name: 'علاج طبيعي للمفاصل والعمود الفقري', priceMin: 2000, priceMax: 7000 },
      { name: 'تأهيل بعد العمليات', priceMin: 3000, priceMax: 10000 },
    ]},
    { name: 'طب نفسي', items: [
      { name: 'استشارة نفسية', priceMin: 3000, priceMax: 10000 },
      { name: 'علاج نفسي سلوكي', priceMin: 3000, priceMax: 10000 },
    ]},
  ]},
  { id: 11, icon: '🐕', name: 'العناية بالحيوانات الأليفة', color: '#FDCB6E', sections: [
    { name: 'رعاية', items: [
      { name: 'تزيين وتنظيف الحيوانات (Grooming)', priceMin: 1000, priceMax: 4000 },
      { name: 'بيطري متنقل', priceMin: 2000, priceMax: 8000 },
      { name: 'تدريب الكلاب', priceMin: 3000, priceMax: 15000 },
    ]},
  ]},
  { id: 12, icon: '🏡', name: 'تحسين المنزل والديكور', color: '#E17055', sections: [
    { name: 'نجارة', items: [
      { name: 'تصنيع أثاث مخصص', priceMin: 10000, priceMax: 100000 },
      { name: 'إصلاح الأثاث', priceMin: 2000, priceMax: 15000 },
      { name: 'تركيب خزائن ومطابخ', priceMin: 5000, priceMax: 60000 },
    ]},
    { name: 'ديكور', items: [
      { name: 'تصميم داخلي', priceMin: 10000, priceMax: 80000 },
      { name: 'تركيب ورق الجدران', priceMin: 3000, priceMax: 20000 },
      { name: 'تركيب ستائر وإضاءة', priceMin: 2000, priceMax: 15000 },
    ]},
    { name: 'حدادة وألومنيوم', items: [
      { name: 'تصنيع نوافذ وأبواب حديد', priceMin: 5000, priceMax: 40000 },
      { name: 'تصنيع بوابات', priceMin: 8000, priceMax: 60000 },
      { name: 'ألومنيوم (شبابيك ورفوف)', priceMin: 5000, priceMax: 30000 },
    ]},
  ]},
  { id: 13, icon: '🍳', name: 'خدمات الطعام والطبخ', color: '#D63031', sections: [
    { name: 'طبخ منزلي', items: [
      { name: 'طبخ يومي للعائلات', priceMin: 2000, priceMax: 8000 },
      { name: 'حلويات جزائرية تقليدية', priceMin: 500, priceMax: 5000 },
      { name: 'طبخ مناسبات وأعراس', priceMin: 10000, priceMax: 100000 },
    ]},
    { name: 'أكل جاهز وتوصيل', items: [
      { name: 'طبخ منزلي بالطلب', priceMin: 500, priceMax: 3000 },
      { name: 'قفة رمضان', priceMin: 2000, priceMax: 10000 },
    ]},
  ]},
  { id: 14, icon: '🎮', name: 'الترفيه والأنشطة', color: '#74B9FF', sections: [
    { name: 'فعاليات', items: [
      { name: 'رحلات وسياحة داخلية', priceMin: 5000, priceMax: 30000 },
      { name: 'أنشطة للأطفال', priceMin: 1000, priceMax: 5000 },
    ]},
  ]},
  { id: 15, icon: '👔', name: 'الخدمات القانونية والمحاسبية', color: '#2D3436', sections: [
    { name: 'قانوني', items: [
      { name: 'محامي (استشارة)', priceMin: 2000, priceMax: 10000 },
      { name: 'موثق ومحضر', priceMin: 3000, priceMax: 15000 },
    ]},
    { name: 'محاسبة', items: [
      { name: 'محاسب قانوني', priceMin: 3000, priceMax: 20000 },
      { name: 'تسوية ضريبية', priceMin: 5000, priceMax: 30000 },
    ]},
  ]},
  { id: 16, icon: '📰', name: 'التسويق والإعلان', color: '#FD79A8', sections: [
    { name: 'إعلان', items: [
      { name: 'إعلانات ورقية وطباعة', priceMin: 2000, priceMax: 20000 },
      { name: 'إعلانات رقمية', priceMin: 3000, priceMax: 30000 },
    ]},
  ]},
  { id: 17, icon: '🎨', name: 'الفنون والحرف اليدوية', color: '#E84393', sections: [
    { name: 'فنون', items: [
      { name: 'رسم (زيتي، أكريليك، مائي)', priceMin: 2000, priceMax: 30000 },
      { name: 'خط عربي', priceMin: 1000, priceMax: 10000 },
      { name: 'نحت وحفر', priceMin: 3000, priceMax: 30000 },
    ]},
    { name: 'حرف يدوية', items: [
      { name: 'كروشيه وتريكو', priceMin: 500, priceMax: 5000 },
      { name: 'صناعة عطور تقليدية', priceMin: 2000, priceMax: 15000 },
      { name: 'فخار وتشكيل طين', priceMin: 3000, priceMax: 20000 },
    ]},
  ]},
  { id: 18, icon: '🌿', name: 'الزراعة والبيئة', color: '#55EFC4', sections: [
    { name: 'زراعة', items: [
      { name: 'زراعة حدائق', priceMin: 3000, priceMax: 20000 },
      { name: 'تهيئة أراضي زراعية', priceMin: 5000, priceMax: 50000 },
      { name: 'خبير نباتات', priceMin: 2000, priceMax: 10000 },
    ]},
  ]},
  { id: 19, icon: '🔐', name: 'الأمن والحراسة', color: '#636E72', sections: [
    { name: 'حراسة', items: [
      { name: 'حارس أمن (يومي/شهري)', priceMin: 3000, priceMax: 20000 },
      { name: 'تركيب كاميرات مراقبة', priceMin: 5000, priceMax: 30000 },
      { name: 'أنظمة إنذار', priceMin: 8000, priceMax: 50000 },
    ]},
  ]},
  { id: 20, icon: '🧹', name: 'خدمات التنظيف المتخصصة', color: '#81ECEC', sections: [
    { name: 'تنظيف', items: [
      { name: 'تنظيف منازل (يومي/أسبوعي)', priceMin: 1000, priceMax: 5000 },
      { name: 'تنظيف بالبخار', priceMin: 3000, priceMax: 15000 },
      { name: 'تنظيف سجاد وتنجيد', priceMin: 2000, priceMax: 10000 },
      { name: 'تنظيف نهاية بناء', priceMin: 5000, priceMax: 30000 },
    ]},
    { name: 'مكافحة حشرات', items: [
      { name: 'رش مبيدات حشرية', priceMin: 2000, priceMax: 8000 },
      { name: 'مكافحة الفئران', priceMin: 2000, priceMax: 6000 },
    ]},
  ]},
  { id: 21, icon: '📦', name: 'التخزين والخدمات اللوجستية', color: '#FFEAA7', sections: [
    { name: 'لوجستيك', items: [
      { name: 'تأجير مخازن', priceMin: 5000, priceMax: 50000 },
      { name: 'خدمات شحن داخلي', priceMin: 1000, priceMax: 15000 },
    ]},
  ]},
  { id: 22, icon: '🎓', name: 'الاستشارات والتدريب', color: '#DFE6E9', sections: [
    { name: 'استشارات', items: [
      { name: 'استشارة إدارية وتجارية', priceMin: 5000, priceMax: 30000 },
      { name: 'تدريب شركات', priceMin: 10000, priceMax: 100000 },
      { name: 'كوتشينج شخصي', priceMin: 3000, priceMax: 15000 },
    ]},
  ]},
  { id: 23, icon: '👶', name: 'رعاية الأطفال والمسنين', color: '#FAB1A0', sections: [
    { name: 'رعاية', items: [
      { name: 'مربية أطفال (Nourrice)', priceMin: 10000, priceMax: 40000 },
      { name: 'مرافق مسنين', priceMin: 8000, priceMax: 30000 },
      { name: 'تمريض مسنين منزلي', priceMin: 5000, priceMax: 20000 },
    ]},
  ]},
  { id: 24, icon: '🏋️', name: 'الرياضة واللياقة البدنية', color: '#00CEC9', sections: [
    { name: 'تدريب', items: [
      { name: 'مدرب شخصي (Personal Trainer)', priceMin: 2000, priceMax: 8000 },
      { name: 'يوجا وتأمل', priceMin: 1500, priceMax: 5000 },
      { name: 'كاراتيه وفنون قتالية', priceMin: 2000, priceMax: 8000 },
    ]},
  ]},
  { id: 25, icon: '🎵', name: 'الموسيقى والفنون الأدائية', color: '#B2BEFF', sections: [
    { name: 'تعليم موسيقى', items: [
      { name: 'عود وقانون', priceMin: 2000, priceMax: 5000 },
      { name: 'غيتار وبيانو', priceMin: 2000, priceMax: 5000 },
      { name: 'غناء وتدريب صوتي', priceMin: 2000, priceMax: 6000 },
    ]},
    { name: 'فرق موسيقية', items: [
      { name: 'فرقة موسيقية للمناسبات', priceMin: 10000, priceMax: 60000 },
    ]},
  ]},
  { id: 26, icon: '📝', name: 'الكتابة والتحرير والترجمة', color: '#778CA3', sections: [
    { name: 'كتابة', items: [
      { name: 'كتابة محتوى رقمي', priceMin: 500, priceMax: 5000 },
      { name: 'تصحيح لغوي', priceMin: 500, priceMax: 3000 },
    ]},
    { name: 'ترجمة', items: [
      { name: 'ترجمة عربي-فرنسي', priceMin: 1000, priceMax: 5000 },
      { name: 'ترجمة عربي-إنجليزي', priceMin: 1000, priceMax: 5000 },
      { name: 'ترجمة معتمدة', priceMin: 3000, priceMax: 15000 },
    ]},
  ]},
  { id: 27, icon: '🎬', name: 'الإنتاج السينمائي والتلفزيوني', color: '#EA8685', sections: [
    { name: 'إنتاج', items: [
      { name: 'إنتاج إعلانات تجارية', priceMin: 20000, priceMax: 200000 },
      { name: 'إنتاج أفلام قصيرة', priceMin: 30000, priceMax: 300000 },
    ]},
  ]},
  { id: 28, icon: '📱', name: 'تطوير التطبيقات والمواقع', color: '#4834D4', sections: [
    { name: 'ويب', items: [
      { name: 'موقع Laravel/Django', priceMin: 30000, priceMax: 150000 },
      { name: 'تطبيق React/Vue', priceMin: 40000, priceMax: 200000 },
      { name: 'API Development', priceMin: 20000, priceMax: 100000 },
    ]},
    { name: 'موبايل', items: [
      { name: 'تطبيق Android', priceMin: 50000, priceMax: 250000 },
      { name: 'تطبيق iOS', priceMin: 60000, priceMax: 300000 },
      { name: 'تطبيق Flutter (Android+iOS)', priceMin: 70000, priceMax: 350000 },
    ]},
  ]},
  { id: 29, icon: '🔬', name: 'العلوم والبحث والتطوير', color: '#6AB04C', sections: [
    { name: 'بحث', items: [
      { name: 'استشارة علمية وتقنية', priceMin: 5000, priceMax: 30000 },
      { name: 'تصميم تجارب ومشاريع', priceMin: 10000, priceMax: 80000 },
    ]},
  ]},
  { id: 30, icon: '🏭', name: 'الصناعة والتصنيع', color: '#7F8C8D', sections: [
    { name: 'تصنيع', items: [
      { name: 'تصنيع قطع غيار مخصصة', priceMin: 5000, priceMax: 100000 },
      { name: 'لحام وتشكيل معادن', priceMin: 3000, priceMax: 30000 },
    ]},
  ]},
  { id: 31, icon: '💼', name: 'الأعمال والإدارة', color: '#2C3E50', sections: [
    { name: 'إدارة', items: [
      { name: 'إدارة مشاريع', priceMin: 10000, priceMax: 60000 },
      { name: 'موارد بشرية', priceMin: 5000, priceMax: 30000 },
    ]},
  ]},
  { id: 32, icon: '🧵', name: 'الخياطة والتفصيل والأزياء', color: '#EB4D4B', sections: [
    { name: 'خياطة', items: [
      { name: 'تفصيل قنادر وفساتين تقليدية', priceMin: 3000, priceMax: 20000 },
      { name: 'تفصيل سروال وقميص', priceMin: 2000, priceMax: 10000 },
      { name: 'إصلاح وتعديل ملابس', priceMin: 500, priceMax: 3000 },
      { name: 'تصميم فساتين عرائس', priceMin: 15000, priceMax: 80000 },
    ]},
  ]},
  { id: 33, icon: '👞', name: 'إصلاح الأحذية والجلود', color: '#6F1E51', sections: [
    { name: 'إصلاح', items: [
      { name: 'إصلاح أحذية', priceMin: 300, priceMax: 2000 },
      { name: 'تلميع الأحذية', priceMin: 100, priceMax: 500 },
      { name: 'صناعة حزام جلد مخصص', priceMin: 1000, priceMax: 5000 },
    ]},
  ]},
  { id: 34, icon: '⏰', name: 'خدمات الطوارئ والإسعاف', color: '#EF5777', sections: [
    { name: 'طوارئ', items: [
      { name: 'سباك طوارئ (24/7)', priceMin: 3000, priceMax: 10000 },
      { name: 'كهربائي طوارئ (24/7)', priceMin: 3000, priceMax: 10000 },
      { name: 'إسعاف أولي منزلي', priceMin: 2000, priceMax: 8000 },
    ]},
  ]},
  { id: 35, icon: '🌐', name: 'خدمات السفر والسياحة', color: '#0652DD', sections: [
    { name: 'سياحة', items: [
      { name: 'تنظيم رحلات داخلية', priceMin: 5000, priceMax: 50000 },
      { name: 'دليل سياحي محلي', priceMin: 3000, priceMax: 15000 },
      { name: 'تذاكر وتأشيرات', priceMin: 2000, priceMax: 20000 },
    ]},
  ]},
  { id: 36, icon: '📄', name: 'الخدمات الإدارية والمعاملات', color: '#1289A7', sections: [
    { name: 'إداري', items: [
      { name: 'إنجاز وثائق إدارية', priceMin: 500, priceMax: 5000 },
      { name: 'متابعة ملفات الولاية والبلدية', priceMin: 1000, priceMax: 8000 },
      { name: 'استخراج شهادات وسجلات', priceMin: 500, priceMax: 3000 },
    ]},
  ]},
  { id: 37, icon: '🔌', name: 'تركيب وصيانة الأجهزة الإلكترونية', color: '#C4E538', sections: [
    { name: 'إصلاح', items: [
      { name: 'إصلاح هواتف ذكية', priceMin: 1000, priceMax: 8000 },
      { name: 'إصلاح أجهزة كمبيوتر', priceMin: 2000, priceMax: 10000 },
      { name: 'إصلاح تلفزيونات', priceMin: 2000, priceMax: 10000 },
      { name: 'إصلاح ثلاجات وآلات غسيل', priceMin: 2000, priceMax: 12000 },
    ]},
  ]},
  { id: 38, icon: '🧪', name: 'خدمات المختبرات والتحاليل', color: '#FDA7DF', sections: [
    { name: 'تحاليل', items: [
      { name: 'تحاليل طبية منزلية', priceMin: 2000, priceMax: 10000 },
      { name: 'تحاليل تربة زراعية', priceMin: 5000, priceMax: 20000 },
    ]},
  ]},
  { id: 39, icon: '📡', name: 'الاتصالات وتكنولوجيا المعلومات', color: '#9980FA', sections: [
    { name: 'شبكات', items: [
      { name: 'تركيب شبكات WiFi', priceMin: 3000, priceMax: 15000 },
      { name: 'إدارة خوادم', priceMin: 10000, priceMax: 60000 },
      { name: 'دعم تقني', priceMin: 1000, priceMax: 5000 },
    ]},
  ]},
  { id: 40, icon: '🏢', name: 'خدمات الشركات والمؤسسات', color: '#475F7B', sections: [
    { name: 'شركات', items: [
      { name: 'تأسيس شركات', priceMin: 10000, priceMax: 50000 },
      { name: 'تدقيق حسابات', priceMin: 15000, priceMax: 100000 },
      { name: 'خدمات سكرتارية', priceMin: 5000, priceMax: 20000 },
    ]},
  ]},
]

// Fast lookup by ID
export const CATEGORIES_MAP: Record<number, CategoryDetail> = Object.fromEntries(
  CATEGORIES_DETAIL.map(c => [c.id, c])
)

(function(){
  const GUIDES={
    sign:{
      desc:"Use the Sign Test when the same learners have two ordered or numerical scores and you want to know whether improvement is more common than decline. It uses only the direction of each learner’s change, not how large that change is.",
      uses:["Compare pre-test and post-test scores for one class when scores are strongly skewed or only their order is trustworthy.","Compare rubric levels for the same student work before and after feedback.","Check whether most trainees need fewer hints after completing an online module."],
      data:"One learner is one observation. Enter one pre-test value and one post-test value for every learner, in the same order in both fields. You need at least 5 learners whose two scores differ; unchanged pairs are excluded. Values may be scores or ordered rubric levels coded as numbers.",
      sources:"Export learner-level scores from an LMS gradebook, a classroom assessment spreadsheet, a rubric-scoring sheet, or a log of hints/errors before and after instruction.",
      example:"Pre-test: 12 15 9 18 14 11\nPost-test: 15 17 12 19 17 14",
      fill:{a:"12 15 9 18 14 11",b:"15 17 12 19 17 14"},
      read:"A significant result with more positive than negative changes means improvement occurred for more learners than decline. It does not say how large the improvement was. Link the pattern to the teaching method only if the study design rules out plausible alternatives.",
      labels:[['labelA','First measurement','Pre-test'],['labelB','Second measurement','Post-test']]
    },
    wilcoxon:{
      desc:"Use the Wilcoxon signed-rank test to evaluate change in the same learners when pre–post differences are not suitably normal. It considers both the direction and the ranked size of each change.",
      uses:["Compare pre-test and post-test scores for one group after a new teaching module.","Compare the same learners’ rubric scores before and after structured feedback.","Compare task-completion time or error counts for the same students before and after practice."],
      data:"One learner is one paired observation. Enter the learner’s first and second score in matching positions. Use at least 6 non-zero pairs; more are preferable. Values must be ordered or numerical, and the two measurements must use the same scale.",
      sources:"LMS test exports, rubric score sheets, performance-task records, classroom observation forms, or learning-analytics exports with one row per learner.",
      example:"Pre-test: 42 55 38 61 47 50 44 58\nPost-test: 54 60 45 68 52 63 49 64",
      fill:{a:"42 55 38 61 47 50 44 58",b:"54 60 45 68 52 63 49 64"},
      read:"A significant result with a positive median change supports a systematic upward shift in scores after instruction. Report the median change and effect size as well as p. A pre–post shift alone does not prove that instruction caused it.",
      labels:[['labelA','First measurement','Pre-test'],['labelB','Second measurement','Post-test']]
    },
    pairedT:{
      desc:"Use a paired t-test to compare the average score at two occasions for the same learners when the learner-level differences are approximately normal and not dominated by outliers.",
      uses:["Compare pre-test and post-test means for students who completed a new course.","Compare accuracy before and after a practice intervention for the same learners.","Compare human-scored and automated numerical scores for the same set of responses when the goal is mean bias, not agreement."],
      data:"One learner or response is one paired observation. Enter exactly one value in each field for each unit, keeping the same order. At least 7 complete pairs are required here; about 30 or more pairs give more stable inference. Values must be numerical on the same scale.",
      sources:"Matched pre/post columns in an LMS export, a student assessment spreadsheet, experiment logs, or paired human and automated score exports joined by learner/response ID.",
      example:"Pre-test: 48 55 62 41 59 53 46 64\nPost-test: 61 63 70 55 66 65 58 72",
      fill:{a:"48 55 62 41 59 53 46 64",b:"61 63 70 55 66 65 58 72"},
      read:"A significant positive mean difference indicates that average scores were higher at the second measurement. The confidence interval shows plausible values for the mean improvement; Cohen’s d describes its standardized size. Causation requires an appropriate comparison or experimental design.",
      labels:[['labelA','First measurement','Pre-test'],['labelB','Second measurement','Post-test']]
    },
    mcnemar:{
      desc:"Use McNemar’s exact test when the same learners are classified into two categories before and after instruction, such as pass/fail or correct/incorrect.",
      uses:["Compare whether each learner passed the same standard before and after a module.","Compare correct/incorrect performance on a target skill before and after instruction.","Compare whether the same students were identified as needing support at two occasions."],
      data:"One learner is one paired observation. Code the positive outcome as 1 and the other outcome as 0. Enter the same learners in the same order in both fields. Only learners who change category determine the test; unchanged learners are still entered.",
      sources:"LMS pass/fail exports, mastery-check spreadsheets, item-level correct/incorrect records, or support/referral status recorded at two time points.",
      example:"Before: 0 0 1 0 1 0 0 1 0 0\nAfter:  1 0 1 1 1 1 0 1 1 0",
      fill:{a:"0 0 1 0 1 0 0 1 0 0",b:"1 0 1 1 1 1 0 1 1 0"},
      read:"A significant result with more 0→1 than 1→0 changes supports an increase in the proportion reaching the educational outcome. It does not measure how far scores improved and does not, by itself, identify the course as the cause.",
      labels:[['labelA','First status','Before instruction'],['labelB','Second status','After instruction']]
    },
    hake:{
      desc:"Use normalized gain to describe how much of the available improvement from the pre-test mean to the maximum score was achieved. It is a descriptive learning-gain index, not a significance test.",
      uses:["Summarize a class’s mean gain from a pre-test to a post-test scored from 0 to 100%.","Compare descriptive gains across course cohorts when all cohorts used the same assessment and scale.","Report learning gain alongside a paired inferential test using learner-level data."],
      data:"Enter two group means expressed as percentages on the same assessment scale: the mean before instruction and the mean after instruction. This calculator uses aggregate means, so it cannot estimate sampling uncertainty or a p-value.",
      sources:"Calculate the two means from an LMS gradebook or assessment spreadsheet after matching the intended learner cohort and handling missing data consistently.",
      example:"Mean pre-test: 40\nMean post-test: 70",
      fill:{pre:"40",post:"70"},
      read:"The result describes the proportion of possible improvement achieved by the group. A medium or high gain may be educationally interesting, but it is not proof of statistical significance or instructional causation. Use participant-level analysis for those questions.",
      labels:[['labelA','First measurement','Pre-test'],['labelB','Second measurement','Post-test']]
    },
    bespalko:{
      desc:"Use the Bespalko mastery coefficient to compare completed essential operations with a criterion that was defined before assessment. It answers whether a specified mastery standard was reached, not whether groups differ statistically.",
      uses:["Assess whether a learner correctly completed the essential steps of a laboratory procedure.","Summarize mastery for a class by counting correctly demonstrated essential operations.","Check attainment of a predefined competency after a practical training unit."],
      data:"Enter the number of essential operations completed correctly and the total number assessed. The unit may be one learner or a clearly defined group total, but state which one. Both the list of essential operations and the .70 threshold must be justified before viewing results.",
      sources:"A competency checklist, practical-exam rubric, observation protocol, simulation log, or a criterion-referenced assessment record.",
      example:"Correct essential operations: 14\nTotal essential operations: 20",
      fill:{correct:"14",total:"20"},
      read:"Ka ≥ .70 means the predefined mastery threshold was reached for the stated unit. It does not provide a p-value, compare teaching approaches, or establish why mastery was or was not achieved.",
      labels:[]
    },
    friedman:{
      desc:"Use the Friedman test to compare three or more measurements from the same learners when scores are ordinal or repeated numerical measurements are not suitably normal.",
      uses:["Compare pre-test, mid-test, and post-test scores for the same class.","Compare the same learners’ engagement ratings at three stages of a course.","Compare performance under three instructional formats experienced by every learner."],
      data:"Each row is one learner; each column is one measurement occasion or condition. Every row must contain the same number of values and no cells may be missing. Enter at least 3 occasions and at least 5 complete learners.",
      sources:"LMS assessment exports joined by learner ID, repeated survey exports, rubric score sheets, or a spreadsheet with one row per learner and one column per occasion.",
      example:"Pre  Mid  Post\n12   15   18\n10   13   16\n14   15   19\n9    12   14\n11   14   17",
      fill:{matrix:"12 15 18\n10 13 16\n14 15 19\n9 12 14\n11 14 17"},
      read:"A significant result means at least one measurement occasion differs from another. It does not identify which occasions differ, so planned or multiplicity-adjusted paired follow-up comparisons are needed before claiming pre–post or mid–post change.",
      labels:[['seriesLabels','Measurement names, comma-separated','Pre-test, Mid-test, Post-test']]
    },
    mannWhitney:{
      desc:"Use the Mann–Whitney U test to compare scores or ordered outcomes from two different groups of learners when normality is doubtful or the outcome is ordinal.",
      uses:["Compare post-test scores for an experimental class and a separate control class.","Compare rubric levels for students taught with two different approaches.","Compare satisfaction ratings from two independent course cohorts."],
      data:"One learner contributes one value to exactly one group. Enter all values for the first group in one field and all values for the second group in the other; group sizes may differ. Use at least 4 learners per group here, preferably more.",
      sources:"LMS gradebooks, independent class or cohort spreadsheets, rubric score exports, or survey responses with a group-membership column.",
      example:"Experimental group: 78 72 85 69 81 76 88 74\nControl group: 65 70 68 61 73 66 69 64",
      fill:{group1:"78 72 85 69 81 76 88 74",group2:"65 70 68 61 73 66 69 64"},
      read:"A significant result indicates that the score distributions differ between the two groups. If their shapes are similar, the result can be discussed as a difference in typical rank/level. Attribute the difference to the intervention only when allocation and baseline evidence support that claim.",
      labels:[['labelA','First group','Experimental group'],['labelB','Second group','Control group']]
    },
    independentT:{
      desc:"Use Welch’s independent-samples t-test to compare average numerical outcomes for two separate groups of learners. Welch’s version allows unequal variances and unequal group sizes.",
      uses:["Compare post-test means for experimental and control groups.","Compare mean course scores for two independent cohorts taught with different formats.","Compare average automated-feedback accuracy between two separate task sets or learner groups."],
      data:"One learner contributes one numerical value to exactly one group. Enter scores for the two groups in separate fields; group sizes may differ. Prefer at least 15 observations per group and inspect strong outliers, especially with small samples.",
      sources:"LMS gradebooks, assessment spreadsheets, experiment exports, or course analytics containing one outcome and one group-membership variable per learner.",
      example:"Experimental group: 82 76 88 79 84 81 74 86\nControl group: 71 69 75 72 68 77 70 73",
      fill:{group1:"82 76 88 79 84 81 74 86",group2:"71 69 75 72 68 77 70 73"},
      read:"A significant mean difference and a confidence interval that excludes zero support a difference in average outcome between groups. Effect sizes show practical magnitude. A causal effectiveness claim additionally requires credible assignment, baseline comparability, and comparable implementation.",
      labels:[['labelA','First group','Experimental group'],['labelB','Second group','Control group']]
    },
    fisher:{
      desc:"Use Fisher’s exact test to compare a binary educational outcome across two independent groups when the 2×2 table is small or expected counts are low.",
      uses:["Compare pass/fail counts in a small experimental group and control group.","Compare completion/non-completion for two versions of an online module.","Compare correct/incorrect classifications produced by two independent assessment conditions."],
      data:"Enter four whole-number counts, not percentages or individual 0/1 records. Rows are independent groups; columns are the positive and negative outcomes. Each learner belongs in exactly one cell.",
      sources:"Count pass/fail, completed/not completed, or correct/incorrect records from an LMS export, gradebook, or study spreadsheet after defining the analysis cohort.",
      example:"                 Passed  Not passed\nExperimental          8           2\nControl               3           7",
      fill:{c11:"8",c12:"2",c21:"3",c22:"7"},
      read:"A significant result supports an association between group and outcome; the odds ratio describes its size and direction. It does not by itself establish that the teaching method caused the higher pass rate.",
      labels:[['labelA','First group','Experimental group'],['labelB','Second group','Control group'],['outcomeYes','Positive outcome','Passed'],['outcomeNo','Other outcome','Not passed']]
    },
    chiSquare:{
      desc:"Use Pearson’s chi-square test to examine whether categorical educational outcomes are distributed differently across independent groups, or whether two categorical variables are associated.",
      uses:["Compare low/medium/high achievement across experimental and control groups.","Test whether preferred learning activity is associated with programme type.","Compare error-type distributions across different course versions."],
      data:"Enter a rectangular table of whole-number counts. Each row is a group/category of the first variable and each column is a category of the second variable. Do not enter percentages or learner-level labels. Expected cell counts should generally be at least 5.",
      sources:"Create a frequency table from an LMS export, survey dataset, rubric-level spreadsheet, error-coding sheet, or student information system after applying explicit category rules.",
      example:"                 Low  Medium  High\nExperimental        5      12    18\nControl            14      16    10",
      fill:{matrix:"5 12 18\n14 16 10"},
      read:"A significant result means the categorical distribution differs across groups or the two variables are associated. Inspect row percentages and specific cells to explain the pattern; chi-square alone does not show causation.",
      labels:[['rowLabels','Row names, comma-separated','Experimental group, Control group'],['columnLabels','Column names, comma-separated','Low, Medium, High']]
    },
    spearman:{
      desc:"Use Spearman’s correlation to assess whether two ordered or numerical educational indicators tend to increase or decrease together without requiring a linear, normally distributed relationship.",
      uses:["Relate engagement-rubric levels to course achievement for the same learners.","Relate time-on-task to post-test score when the data are skewed.","Compare the ordering produced by automated assessment with expert scores."],
      data:"One learner or response is one paired observation. Enter two values for every unit in matching order and with no missing counterpart. At least 5 pairs are required here; about 30 or more are preferable. Values may be ranks, ordered ratings, or numerical measurements.",
      sources:"Join LMS analytics, gradebook scores, survey/rubric ratings, or automated and expert score exports by learner or response ID.",
      example:"Engagement level: 2 4 3 5 1 4 3 5\nPost-test score: 61 78 69 88 54 81 72 91",
      fill:{a:"2 4 3 5 1 4 3 5",b:"61 78 69 88 54 81 72 91"},
      read:"A significant positive coefficient means learners with higher values on one indicator tend to have higher values on the other. The coefficient describes association, not improvement or causal effectiveness; consider third variables such as prior achievement.",
      labels:[['labelA','First indicator','Engagement level'],['labelB','Second indicator','Post-test score']]
    },
    pearson:{
      desc:"Use Pearson’s correlation to quantify a linear relationship between two numerical educational indicators measured for the same learners or responses.",
      uses:["Relate time-on-task to post-test score for the same learners.","Relate pre-test achievement to final course score.","Relate automated numerical scores to expert numerical scores for the same responses."],
      data:"One learner or response is one paired observation. Enter matching numerical values in the same order. Prefer at least 30 pairs. Inspect the scatterplot: the relationship should be roughly linear and not driven by a few extreme observations.",
      sources:"LMS analytics joined to gradebook data, matched assessment records, survey scale totals, or human and automated scoring exports joined by response ID.",
      example:"Time on task (min): 35 48 27 62 51 44 70 39\nPost-test score: 64 75 58 88 79 72 93 68",
      fill:{a:"35 48 27 62 51 44 70 39",b:"64 75 58 88 79 72 93 68"},
      read:"A significant positive r means higher values on one indicator are linearly associated with higher values on the other. The confidence interval shows uncertainty in the association. Correlation neither proves causation nor directly evaluates a teaching method.",
      labels:[['labelA','Horizontal-axis indicator','Time on task (min)'],['labelB','Vertical-axis indicator','Post-test score']]
    },
    cronbach:{
      desc:"Use Cronbach’s alpha to evaluate whether items intended to form one questionnaire or test scale produce sufficiently consistent scores in a pilot sample.",
      uses:["Check internal consistency of a learner-engagement questionnaire before the main study.","Evaluate a multi-item attitude or self-efficacy scale.","Check consistency of a set of test items intended to measure one educational construct."],
      data:"Each row is one respondent; each column is one scored item. All respondents must have the same number of item scores and items must be coded in the same direction. Enter at least 20 respondents here, preferably 30 or more, and at least 2 items.",
      sources:"Item-level exports from survey tools, LMS quizzes, Google/Microsoft Forms, or a spreadsheet containing scored questionnaire/test responses. Reverse-code negatively worded items before entry.",
      example:"I1 I2 I3 I4 I5\n4  5  3  4  5\n3  4  3  4  4\n5  5  4  5  5\n2  3  2  3  3\n4  4  4  5  4",
      fill:{matrix:"4 5 3 4 5\n3 4 3 4 4\n5 5 4 5 5\n2 3 2 3 3\n4 4 4 5 4"},
      read:"Alpha near or above a justified reliability benchmark supports using the item set as a consistent scale. It does not prove that the scale measures one construct, is valid, or can detect teaching effectiveness; inspect item quality and validity separately.",
      labels:[['seriesLabels','Item names, comma-separated','Interest 1, Interest 2, Interest 3, Interest 4, Interest 5']]
    },
    kappa:{
      desc:"Use Cohen’s kappa to evaluate agreement beyond chance when two raters assign the same categorical labels to the same learner responses, products, or performances.",
      uses:["Compare an expert’s category with an automated scoring system for the same responses.","Check agreement between two teachers applying a rubric category to student work.","Evaluate consistency of pass/revise decisions made by two assessors."],
      data:"One response or student product is one paired observation. Enter one category label per line for each rater, keeping identical object order and the same spelling for the same category. About 20 or more rated objects are recommended.",
      sources:"Two independent rubric-scoring sheets, an expert rating export paired with automated classifications, moderation records, or coded observation forms joined by response/work ID.",
      example:"Human rater:     High / Medium / Low / High / Medium\nAutomated system: High / Medium / Low / Medium / Medium",
      fill:{labels1:"High\nMedium\nLow\nHigh\nMedium",labels2:"High\nMedium\nLow\nMedium\nMedium"},
      read:"Higher kappa means the two raters classify educational evidence more consistently beyond chance. If agreement is too low for the intended use, refine the rubric, retrain/calibrate raters, or revise the automated system before treating the labels as dependable outcomes.",
      labels:[['labelA','First rater/source','Human rater'],['labelB','Second rater/source','Automated system']]
    },
    kendallW:{
      desc:"Use Kendall’s W to evaluate how consistently three or more experts rank the same educational materials, student products, criteria, or alternatives.",
      uses:["Check whether experts agree on the ranking of proposed course modules.","Assess concordance when several judges rank student projects.","Evaluate expert prioritization of competencies or assessment criteria."],
      data:"Each row is one object being ranked; each column is one rater. All raters must rank the same objects using the same criterion. Enter rank values, with at least 3 raters and about 7 or more objects.",
      sources:"Expert review forms, Delphi-study spreadsheets, competition judging sheets, curriculum-evaluation matrices, or ranking exports combined by object ID.",
      example:"          Expert 1  Expert 2  Expert 3\nModule A         1         1         2\nModule B         2         2         1\nModule C         3         3         3\nModule D         4         5         4\nModule E         5         4         5",
      fill:{matrix:"1 1 2\n2 2 1\n3 3 3\n4 5 4\n5 4 5"},
      read:"W near 1 indicates that experts rank the objects similarly; W near 0 indicates little concordance. Statistical significance alone is not enough—judge whether the strength of agreement is sufficient for the educational decision.",
      labels:[['seriesLabels','Rater names, comma-separated','Expert 1, Expert 2, Expert 3']]
    },
    anova:{
      desc:"Use one-way ANOVA to compare average numerical outcomes across three or more separate learner groups or course conditions.",
      uses:["Compare post-test means for control, blended-learning, and online-learning groups.","Compare achievement across three independent teaching-method cohorts.","Compare average rubric scores across three separate feedback conditions."],
      data:"Each line is one independent group; values on that line are individual learners’ numerical scores. A learner must appear in only one group. Enter at least 3 groups with at least 2 values each; about 15 or more per group is preferable.",
      sources:"LMS gradebooks or assessment spreadsheets containing one outcome score and one group/condition variable per learner.",
      example:"Control: 65 68 70 72 67 69\nBlended: 74 78 73 80 76 77\nOnline: 71 75 72 74 70 76",
      fill:{groups:"65 68 70 72 67 69\n74 78 73 80 76 77\n71 75 72 74 70 76"},
      read:"A significant omnibus F test means at least one group mean differs, but it does not identify which one. Use justified, multiplicity-controlled post-hoc comparisons before naming specific differences. Causal interpretation depends on how groups were formed and whether they were comparable.",
      labels:[['seriesLabels','Group names, comma-separated','Control group, Blended learning, Online learning']]
    }
  };

  const RU_GUIDES={
    sign:{desc:"Критерий знаков применяют к двум измерениям одних и тех же учащихся, когда важно проверить, у скольких результат улучшился, а не величину улучшения.",uses:["Сравнить входной и итоговый тест одной группы при асимметричных баллах.","Сравнить уровни рубрики до и после обратной связи.","Проверить, большинству ли учащихся стало требоваться меньше подсказок."],data:"Один учащийся — одно связанное наблюдение. Введите по одному результату до и после в одинаковом порядке. Нужно не менее 5 учащихся с изменившимся результатом; совпавшие пары исключаются.",sources:"Выгрузка тестов из LMS, журнал оценок, таблица рубрики или лог подсказок до и после обучения.",read:"Значимый результат при преобладании положительных изменений означает, что улучшившихся учащихся больше, чем ухудшившихся. Величину улучшения критерий не показывает."},
    wilcoxon:{desc:"Критерий Уилкоксона оценивает изменение у тех же учащихся, если разности до и после ненормальны или данные порядковые.",uses:["Сравнить входной и итоговый тест после нового модуля.","Сравнить уровни рубрики до и после обратной связи.","Сравнить время или число ошибок до и после практики."],data:"Один учащийся — одна пара. Введите результаты первого и второго измерения в совпадающем порядке. Нужно не менее 6 ненулевых пар; шкала измерений должна быть одинаковой.",sources:"Выгрузки LMS, таблицы рубрик, результаты практических заданий или учебная аналитика по учащимся.",read:"Значимый результат и положительная медиана изменения подтверждают систематический рост результата. Укажите медиану изменения и размер эффекта; связь роста с методикой зависит от дизайна."},
    pairedT:{desc:"Парный t-критерий сравнивает средние результаты двух измерений у тех же учащихся, если индивидуальные разности близки к нормальным и не имеют сильных выбросов.",uses:["Сравнить средние входного и итогового теста после курса.","Сравнить точность до и после тренировочного задания.","Сравнить числовые оценки эксперта и автоматической системы для тех же ответов."],data:"Один учащийся или ответ — одна пара. Введите по одному числу в каждое поле в совпадающем порядке. Минимум 7 полных пар; около 30 пар дают более устойчивую оценку.",sources:"Совмещённые столбцы до/после из LMS, таблица результатов, логи эксперимента или оценки эксперта и системы, соединённые по ID.",read:"Значимая положительная средняя разность означает, что во втором измерении средний результат выше. Доверительный интервал показывает неопределённость, d Коэна — стандартизированную величину."},
    mcnemar:{desc:"Точный критерий Мак-Немара используют, когда те же учащиеся относятся к двум категориям до и после обучения, например зачёт/незачёт.",uses:["Сравнить достижение порога до и после модуля.","Сравнить правильность целевого навыка до и после обучения.","Сравнить потребность в поддержке в двух точках."],data:"Один учащийся — одна пара. Кодируйте положительный исход как 1, другой как 0; порядок должен совпадать. Расчёт определяется учащимися, сменившими категорию.",sources:"Выгрузки зачёт/незачёт из LMS, проверки освоения, данные правильно/неправильно или статус поддержки в двух точках.",read:"Значимый результат при преобладании переходов 0→1 подтверждает увеличение доли достигших результата, но не показывает величину изменения балла и сам по себе не доказывает причину."},
    hake:{desc:"Нормализованный прирост показывает долю доступного улучшения от среднего входного результата до максимума. Это описательный показатель, а не критерий значимости.",uses:["Описать прирост среднего результата класса от входного к итоговому тесту.","Сравнить описательный прирост потоков на одной шкале.","Дополнить парный статистический анализ показателем учебного прироста."],data:"Введите два средних процента по одной шкале: до и после обучения. По агрегированным средним нельзя рассчитать p-значение или неопределённость выборки.",sources:"Рассчитайте средние по одной и той же группе из LMS или таблицы оценивания после согласованной обработки пропусков.",read:"Результат описывает долю возможного улучшения. Средний или высокий прирост может быть практически важен, но не доказывает статистическую значимость или причинную эффективность."},
    bespalko:{desc:"Коэффициент Беспалько сопоставляет число правильно выполненных существенных операций с порогом освоения, заданным до проверки.",uses:["Оценить освоение обязательных этапов лабораторной работы.","Обобщить выполнение существенных операций группой.","Проверить достижение компетенции после практического модуля."],data:"Введите число правильно выполненных существенных операций и их общее число. Укажите, относится ли результат к одному учащемуся или группе; перечень операций и порог 0,70 задаются заранее.",sources:"Чек-лист компетенций, рубрика практического экзамена, протокол наблюдения, лог симулятора или критериальная проверка.",read:"Ka ≥ 0,70 означает достижение заранее заданного порога. Показатель не даёт p-значение, не сравнивает методы обучения и не объясняет причину результата."},
    friedman:{desc:"Критерий Фридмана сравнивает три и более измерения тех же учащихся при порядковых или ненормальных повторных данных.",uses:["Сравнить входной, промежуточный и итоговый тест.","Сравнить вовлечённость на трёх этапах курса.","Сравнить три условия обучения, пройденные каждым учащимся."],data:"Каждая строка — один учащийся, каждый столбец — момент или условие. Во всех строках одинаковое число значений без пропусков; минимум 3 измерения и 5 полных участников.",sources:"Выгрузки LMS, соединённые по ID, повторные опросы, таблицы рубрик или таблица с одной строкой на учащегося.",read:"Значимый общий результат означает различие хотя бы одной точки измерения. Чтобы указать конкретные различия, нужны запланированные или скорректированные попарные сравнения."},
    mannWhitney:{desc:"U-критерий Манна–Уитни сравнивает баллы или порядковые результаты двух разных групп при сомнительной нормальности.",uses:["Сравнить итоговые баллы экспериментальной и контрольной групп.","Сравнить уровни рубрики при двух подходах.","Сравнить удовлетворённость двух независимых потоков."],data:"Один учащийся входит только в одну группу. Введите значения групп в разные поля; размеры могут различаться. В инструменте нужно не менее 4 учащихся на группу.",sources:"Журналы LMS, таблицы независимых классов, выгрузки рубрик или опрос с признаком группы.",read:"Значимый результат показывает различие распределений двух групп. Причинный вывод требует обоснованного распределения по группам и сопоставимости исходных результатов."},
    independentT:{desc:"t-критерий Уэлча сравнивает средние числовые результаты двух отдельных групп и допускает разные дисперсии и размеры.",uses:["Сравнить итоговые средние экспериментальной и контрольной групп.","Сравнить два независимых потока с разными форматами обучения.","Сравнить среднюю точность обратной связи в двух условиях."],data:"Один учащийся даёт одно число только в одной группе. Введите баллы групп отдельно; желательно не менее 15 наблюдений в каждой и проверка сильных выбросов.",sources:"Журналы LMS, таблицы оценивания, экспериментальные выгрузки или аналитика с результатом и признаком группы.",read:"Значимая средняя разность и интервал без нуля подтверждают различие средних. Размер эффекта показывает практическую величину; причинность зависит от формирования групп."},
    fisher:{desc:"Точный критерий Фишера сравнивает бинарный результат двух независимых групп при малой таблице 2 × 2.",uses:["Сравнить зачёт/незачёт в малых экспериментальной и контрольной группах.","Сравнить завершение двух версий онлайн-модуля.","Сравнить правильно/неправильно в двух независимых условиях."],data:"Введите четыре целых частоты, не проценты и не индивидуальные 0/1. Строки — группы, столбцы — положительный и отрицательный исход; каждый учащийся находится в одной ячейке.",sources:"Подсчитайте зачёт/незачёт, завершение или правильность из LMS, журнала или исследовательской таблицы.",read:"Значимый результат подтверждает связь группы с исходом; отношение шансов показывает направление и величину. Сам критерий не доказывает, что методика вызвала различие."},
    chiSquare:{desc:"Критерий хи-квадрат проверяет, различается ли распределение категорий результата между независимыми группами или связаны ли две категориальные переменные.",uses:["Сравнить низкий/средний/высокий уровень в экспериментальной и контрольной группах.","Проверить связь предпочитаемой активности с типом программы.","Сравнить виды ошибок в версиях курса."],data:"Введите прямоугольную таблицу целых частот. Строки — категории первой переменной, столбцы — второй. Не вводите проценты; ожидаемые частоты обычно должны быть не меньше 5.",sources:"Таблица частот из LMS, опроса, рубрики, кодировки ошибок или информационной системы учащихся.",read:"Значимый результат означает различие категориальных распределений или связь переменных. Объясняйте паттерн по процентам строк и ячейкам; причинность не устанавливается."},
    spearman:{desc:"Корреляция Спирмена оценивает совместное изменение двух порядковых или числовых показателей тех же учащихся без требования линейности и нормальности.",uses:["Связать вовлечённость с итоговым баллом.","Связать время работы с результатом при асимметричных данных.","Сопоставить порядок автоматических и экспертных оценок."],data:"Один учащийся или ответ — одна пара. Введите два показателя в совпадающем порядке без пропущенной пары; минимум 5 пар, предпочтительно около 30.",sources:"Соедините по ID аналитику LMS, оценки, показатели опроса/рубрики или автоматические и экспертные оценки.",read:"Значимая положительная связь означает, что более высокие значения одного показателя обычно сопровождаются более высокими значениями другого. Это не доказывает причинность."},
    pearson:{desc:"Корреляция Пирсона оценивает линейную связь двух числовых показателей тех же учащихся или ответов.",uses:["Связать время работы с итоговым баллом.","Связать входной результат с итоговой оценкой.","Связать числовые оценки системы и эксперта."],data:"Один учащийся или ответ — одна пара. Введите соответствующие числа в одинаковом порядке; желательно не менее 30 пар. Проверьте линейность и выбросы по диаграмме.",sources:"Соединённые по ID данные LMS и журнала, суммарные баллы шкал или оценки человека и системы.",read:"Значимый положительный r показывает линейную связь; доверительный интервал — её неопределённость. Корреляция не доказывает причинность и напрямую не оценивает методику."},
    cronbach:{desc:"Альфа Кронбаха оценивает согласованность пунктов теста или анкеты, которые должны образовывать одну педагогическую шкалу.",uses:["Проверить анкету вовлечённости перед основным исследованием.","Оценить шкалу отношения или самоэффективности.","Проверить задания, измеряющие один конструкт."],data:"Каждая строка — респондент, каждый столбец — пункт. Число пунктов во всех строках одинаково, направление кодирования едино; минимум 20 респондентов, желательно 30.",sources:"Пунктовые выгрузки опросов, LMS-тестов, Forms или таблица ответов. Обратные пункты перекодируйте заранее.",read:"Достаточная альфа поддерживает использование пунктов как согласованной шкалы, но не доказывает одномерность, валидность или способность оценивать эффективность обучения."},
    kappa:{desc:"Каппа Коэна оценивает согласие сверх случайного уровня, когда два оценщика присваивают категории тем же ответам или работам.",uses:["Сравнить категорию эксперта и автоматической системы.","Проверить применение рубрики двумя преподавателями.","Сравнить решения зачёт/доработка двух оценщиков."],data:"Один ответ или работа — одна пара категорий. Введите по одной категории на строку для каждого оценщика в одинаковом порядке и с одинаковым написанием; рекомендуется около 20 объектов.",sources:"Две таблицы оценивания, выгрузка эксперта и классификатора, записи модерации или формы наблюдений, соединённые по ID работы.",read:"Чем выше каппа, тем устойчивее совпадают категории сверх случайности. При слабом согласии уточните рубрику, калибруйте экспертов или пересмотрите автоматическую систему."},
    kendallW:{desc:"W Кендалла оценивает согласованность ранжирования одних и тех же материалов, работ или критериев тремя и более экспертами.",uses:["Проверить согласие экспертов о приоритете модулей.","Оценить согласованность рангов студенческих проектов.","Сопоставить приоритеты компетенций или критериев."],data:"Каждая строка — ранжируемый объект, каждый столбец — эксперт. Все оценивают одни объекты по одному критерию; минимум 3 эксперта и около 7 объектов.",sources:"Экспертные формы, таблицы Delphi, судейские листы, матрицы оценки программы или ранги, соединённые по объекту.",read:"W около 1 означает близкие ранги, около 0 — слабую согласованность. Одной статистической значимости недостаточно: сила согласия должна соответствовать решению."},
    anova:{desc:"Однофакторный дисперсионный анализ сравнивает средние числовые результаты трёх и более отдельных групп или условий обучения.",uses:["Сравнить контрольную, смешанную и онлайн-группы.","Сравнить три независимых потока с разными методиками.","Сравнить средние баллы рубрики в трёх условиях обратной связи."],data:"Каждая строка — независимая группа, значения — индивидуальные баллы. Учащийся входит только в одну группу; минимум 3 группы и 2 значения, желательно 15 и более на группу.",sources:"Журналы LMS или таблицы с одним итоговым баллом и признаком группы/условия для каждого учащегося.",read:"Значимый F показывает различие хотя бы одного среднего, но не указывает конкретные группы. Для этого нужны попарные сравнения с поправкой; причинность зависит от формирования групп."}
  };

  function esc(value){return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
  function list(items){return `<ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;}
  function addNamingFields(guide){
    if(!guide.labels.length)return;
    const card=document.querySelector('.method-layout section.card');
    const actions=card?.querySelector('.actions');
    if(!card||!actions)return;
    document.getElementById('studyLabels')?.remove();
    const box=document.createElement('div');
    box.id='studyLabels';box.className='study-labels';
    const ru=window.Lang?.get()==='ru',labelRu={"First measurement":"Первое измерение","Second measurement":"Второе измерение","First status":"Статус до","Second status":"Статус после","First group":"Первая группа","Second group":"Вторая группа","Positive outcome":"Положительный результат","Other outcome":"Другой результат","Row names, comma-separated":"Названия строк через запятую","Column names, comma-separated":"Названия столбцов через запятую","First indicator":"Первый показатель","Second indicator":"Второй показатель","Horizontal-axis indicator":"Показатель по горизонтали","Vertical-axis indicator":"Показатель по вертикали","First rater/source":"Первый оценщик или источник","Second rater/source":"Второй оценщик или источник","Measurement names, comma-separated":"Названия измерений через запятую","Item names, comma-separated":"Названия пунктов через запятую","Rater names, comma-separated":"Имена экспертов через запятую","Group names, comma-separated":"Названия групп через запятую","Pre-test":"Входной тест","Post-test":"Итоговый тест","Before instruction":"До обучения","After instruction":"После обучения","Experimental group":"Экспериментальная группа","Control group":"Контрольная группа","Human rater":"Эксперт","Automated system":"Автоматическая система"},tr=v=>labelRu[v]||window.Lang?.translateExact(v)||v;
    box.innerHTML=`<div class="kicker">${ru?'Подписи графика':'Chart labels'}</div><h3>${ru?'Назовите данные':'Name your data'}</h3><p class="muted compact-text">${ru?'Необязательно. Эти названия появятся на графиках и в тексте результата.':'Optional. These names will be used in charts and result text.'}</p><div class="label-grid">${guide.labels.map(([id,label,def])=>`<div class="field"><label for="${id}">${esc(ru?tr(label):label)}</label><input id="${id}" type="text" placeholder="${esc(ru?tr(def):def)}" data-default="${esc(ru?tr(def):def)}"></div>`).join('')}</div>`;
    card.insertBefore(box,actions);
  }
  function render(){
    const calc=document.body.dataset.calc,base=GUIDES[calc];if(!base)return;const ru=window.Lang?.get()==='ru',guide=ru?{...base,...RU_GUIDES[calc]}:base;
    addNamingFields(guide);
    const aside=document.querySelector('.method-layout aside.card');
    const desc=aside?.querySelector(':scope > p.muted');
    if(desc){desc.textContent=guide.desc;desc.dataset.originalEn=guide.desc;}
    let section=document.getElementById('educationalGuide');
    if(!section){section=document.createElement('section');section.id='educationalGuide';section.className='educational-guide';const main=document.querySelector('main.shell'),layout=main?.querySelector('.method-layout');if(main)main.insertBefore(section,layout||null);}
    section.innerHTML=`
      <div class="guide-heading"><div class="kicker">${ru?'От исследовательского вопроса к расчёту':'From research question to calculator'}</div><h2>${ru?'Как применять метод в педагогическом исследовании':'How to use this method in an educational study'}</h2><p class="muted">${ru?'Сначала сопоставьте метод со сценарием, затем проверьте единицу наблюдения и структуру данных.':'Start with the study scenario, then verify the observation unit and data structure before calculating.'}</p></div>
      <div class="guide-grid">
        <article class="guide-card guide-wide"><span class="guide-number">1</span><div><h3>${ru?'Когда метод применяют в педагогическом исследовании?':'When would you use this in an educational study?'}</h3>${list(guide.uses)}</div></article>
        <article class="guide-card"><span class="guide-number">2</span><div><h3>${ru?'Какие данные вводить?':'What data should you enter?'}</h3><p>${esc(guide.data)}</p></div></article>
        <article class="guide-card"><span class="guide-number">3</span><div><h3>${ru?'Откуда взять эти данные?':'Where do these data come from?'}</h3><p>${esc(guide.sources)}</p></div></article>
        <article class="guide-card example-card"><span class="guide-number">4</span><div><h3>${ru?'Пример ввода':'Example input'}</h3><pre>${esc(guide.example)}</pre><button class="btn secondary" type="button" id="useExampleBtn">${ru?'Использовать пример':'Use this example'}</button><span class="copy-status" id="exampleStatus"></span></div></article>
        <article class="guide-card"><span class="guide-number">5</span><div><h3>${ru?'Как интерпретировать результат в педагогическом контексте?':'How to read the result in a pedagogical context?'}</h3><p>${esc(guide.read)}</p></div></article>
      </div>`;
    document.getElementById('useExampleBtn')?.addEventListener('click',()=>{
      Object.entries(guide.fill).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.value=value;});
      const status=document.getElementById('exampleStatus');if(status)status.textContent=ru?'Пример добавлен выше.':'Example added above.';
      document.querySelector('.method-layout section.card')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  window.MethodGuide={
    name(id,fallback){const el=document.getElementById(id);return el?.value.trim()||el?.dataset.default||fallback;},
    names(id,count,prefix){const raw=document.getElementById(id)?.value.trim()||document.getElementById(id)?.dataset.default||'';const values=raw.split(',').map(x=>x.trim()).filter(Boolean);return Array.from({length:count},(_,i)=>values[i]||`${prefix} ${i+1}`);}
  };
  document.addEventListener('DOMContentLoaded',render);
  document.addEventListener('languagechange',render);
})();

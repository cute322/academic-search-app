document.addEventListener('DOMContentLoaded', () => {
    // --- 1. تعريف المتغيرات والعناصر ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');

    const mainInput = document.getElementById('main-input');
    const searchNowBtn = document.getElementById('search-now-btn');
    const exactMatchCheckbox = document.getElementById('exact-match-checkbox');
    const excludeWordCheckbox = document.getElementById('exclude-word-checkbox');
    const siteSearchCheckbox = document.getElementById('site-search-checkbox');

    const resultsSection = document.getElementById('results-section');
    const filetypeFilter = document.getElementById('filetype-filter');
    const dateFilter = document.getElementById('date-filter');
    const specializationFilter = document.getElementById('specialization-filter');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const searchResultsList = document.getElementById('search-results-list');
    const loadMoreBtn = document.getElementById('load-more-btn');

    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const langSelect = document.getElementById('lang-select');

    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const favoritesList = document.getElementById('favorites-list');

    // Modal elements
    const favoriteNameModal = document.getElementById('favorite-name-modal');
    const favoriteNameInput = document.getElementById('favorite-name-input');
    const saveFavoriteBtn = document.getElementById('save-favorite-btn');
    const closeBtns = document.querySelectorAll('.close-btn');

    // State variables
    let queryState = {
        keywords: '',
        exactMatch: false,
        excludeWord: '', // Will store the word to exclude if checkbox is checked
        siteSearch: '',  // Will store the site if checkbox is checked
        filetype: '',
        date: '',
        specialization: ''
    };
    let currentSearchUrl = ''; // To store the generated URL for search/copy

    // --- 2. نظام تغيير اللغة (Internationalization) ---
    const locales = {
        ar: {
            appTitle: "Academic Search",
            navHome: "الرئيسية",
            navAbout: "حول",
            navContact: "اتصل بنا",
            navHistory: "السجلّ",
            navFavorites: "المفضلة",
            toggleThemeBtnKey: "التبديل إلى الوضع الداكن",
            heroTitle: "ابحث عن المعرفة الأكاديمية",
            mainInputPlaceholder: "اكتب كلماتك المفتاحية للبحث الأكاديمي...",
            searchBtn: "بحث",
            exactMatch: "بحث مطابق",
            excludeWord: "استبعاد كلمة",
            siteSearch: "بحث داخل موقع محدد",
            filterTitle: "فلترة النتائج",
            filetypeFilter: "نوع الملف:",
            dateFilter: "التاريخ:",
            specializationFilter: "التخصص:",
            applyFilters: "تطبيق الفلاتر",
            loadMore: "تحميل المزيد",
            aboutTitle: "حول Academic Search",
            aboutText: "Academic Search App منصة تساعد الباحثين والطلبة على صياغة استعلامات بحثية دقيقة عبر محركات بحث أكاديمية موثوقة مثل Google Scholar, ResearchGate, Semantic Scholar. تهدف المنصة إلى تبسيط عملية البحث الأكاديمي وتوفير أدوات فعالة للوصول إلى المعلومات العلمية بسهولة ويسر.",
            contactTitle: "اتصل بنا",
            contactName: "الاسم:",
            contactEmail: "البريد الإلكتروني:",
            contactMessage: "الرسالة:",
            sendMessage: "إرسال الرسالة",
            historyTitle: "سجلّ البحث",
            favoritesTitle: "الاستعلامات المفضلة",
            clearHistoryBtn: "مسح السجلّ",
            copyrightText: "© 2025 Academic Search. جميع الحقوق محفوظة.",
            privacyPolicy: "سياسة الخصوصية",
            termsOfUse: "شروط الاستخدام",
            saveToFavoritesTitle: "حفظ في المفضلة",
            favoriteNamePlaceholder: "أدخل اسمًا للاستعلام...",
            saveBtn: "حفظ",
            historyEmpty: "لا يوجد أي سجل بحث حتى الآن.",
            favoritesEmpty: "لا توجد أي استعلامات محفوظة في المفضلة.",
            confirmDelete: "هل أنت متأكد من حذف هذا العنصر؟",
            confirmClearHistory: "تحذير: سيتم حذف جميع سجلات البحث بشكل نهائي. هل أنت متأكد؟",
            queryEmpty: "يرجى إدخال كلمات مفتاحية أولاً.",
            favoriteNameMissing: "يرجى إدخال اسم للاستعلام.",
            reSearch: "إعادة البحث",
            delete: "حذف",
            apply: "تطبيق",
            sourceLabel: "المصدر", // Changed from engineLabel to sourceLabel
        },
        en: {
            appTitle: "Academic Search",
            navHome: "Home",
            navAbout: "About",
            navContact: "Contact",
            navHistory: "History",
            navFavorites: "Favorites",
            toggleThemeBtnKey: "Switch to Dark Mode",
            heroTitle: "Search for Academic Knowledge",
            mainInputPlaceholder: "Type your keywords for academic search...",
            searchBtn: "Search",
            exactMatch: "Exact Match",
            excludeWord: "Exclude Word",
            siteSearch: "Search within specific site",
            filterTitle: "Filter Results",
            filetypeFilter: "File Type:",
            dateFilter: "Date:",
            specializationFilter: "Specialization:",
            applyFilters: "Apply Filters",
            loadMore: "Load More",
            aboutTitle: "About Academic Search",
            aboutText: "Academic Search App is a platform that helps researchers and students formulate precise search queries across reliable academic search engines like Google Scholar, ResearchGate, and Semantic Scholar. The platform aims to simplify the academic search process and provide effective tools for easy access to scientific information.",
            contactTitle: "Contact Us",
            contactName: "Name:",
            contactEmail: "Email:",
            contactMessage: "Message:",
            sendMessage: "Send Message",
            historyTitle: "Search History",
            favoritesTitle: "Favorite Queries",
            clearHistoryBtn: "Clear History",
            copyrightText: "© 2025 Academic Search. All rights reserved.",
            privacyPolicy: "Privacy Policy",
            termsOfUse: "Terms of Use",
            saveToFavoritesTitle: "Save to Favorites",
            favoriteNamePlaceholder: "Enter a name for the query...",
            saveBtn: "Save",
            historyEmpty: "No search history yet.",
            favoritesEmpty: "No favorite queries saved yet.",
            confirmDelete: "Are you sure you want to delete this item?",
            confirmClearHistory: "Warning: This will permanently delete your entire search history. Are you sure?",
            queryEmpty: "Please enter keywords first.",
            favoriteNameMissing: "Please enter a name for the query.",
            reSearch: "Re-search",
            delete: "Delete",
            apply: "Apply",
            sourceLabel: "Source",
        }
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.classList.remove('lang-ar', 'lang-en');
        document.body.classList.add(`lang-${lang}`);
        localStorage.setItem('language', lang);
        langSelect.value = lang;

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            const translation = locales[lang][key];
            if (translation) {
                if (el.placeholder) el.placeholder = translation;
                else el.textContent = translation;
            }
        });
        updateThemeButtonText();
        // Update specific elements not covered by data-lang-key
        loadMoreBtn.textContent = locales[lang].loadMore;
        // Re-render lists to update language
        if (document.getElementById('history-screen').classList.contains('active')) loadHistory();
        if (document.getElementById('favorites-screen').classList.contains('active')) loadFavorites();
    };

    const deviceId = (() => {
        let id = localStorage.getItem('deviceId');
        if (!id) { id = 'web-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9); localStorage.setItem('deviceId', id); }
        return id;
    })();

    // --- 3. وظائف بناء الاستعلام وتحديث الواجهة ---
    const updateQueryStateFromUI = () => {
        queryState.keywords = mainInput.value.trim();
        queryState.exactMatch = exactMatchCheckbox.checked;
        // For excludeWord and siteSearch, we'd need input fields to get the actual word/site
        // For now, if checked, we'll just add a placeholder to the query
        queryState.excludeWord = excludeWordCheckbox.checked ? 'placeholder_exclude' : '';
        queryState.siteSearch = siteSearchCheckbox.checked ? 'example.com' : ''; // Placeholder site

        queryState.filetype = filetypeFilter.value;
        queryState.date = dateFilter.value;
        queryState.specialization = specializationFilter.value;
    };

    const generateSearchUrl = () => {
        let queryParts = [];
        let baseUrl = "https://scholar.google.com/scholar?q="; // Default to Google Scholar

        if (queryState.keywords) {
            queryParts.push(queryState.keywords);
        }

        if (queryState.exactMatch) {
            queryParts.push(`"${queryState.keywords}"`); // Apply exact match to main keywords
        }
        if (queryState.excludeWord) {
            queryParts.push(`-${queryState.excludeWord}`);
        }
        if (queryState.siteSearch) {
            queryParts.push(`site:${queryState.siteSearch}`);
        }
        if (queryState.filetype) {
            queryParts.push(`filetype:${queryState.filetype}`);
        }
        // Date and specialization are complex for direct URL query, usually handled by engine's UI
        // For simplicity, we'll just add them as keywords if they are not direct operators
        if (queryState.date && queryState.date !== 'custom') {
            // Example: Google Scholar has "as_ylo" and "as_yhi" for year range
            // This is a simplification. Real implementation needs more logic.
            if (queryState.date === 'last-year') queryParts.push('after:2023'); // Example
            if (queryState.date === 'last-5-years') queryParts.push('after:2019'); // Example
        }
        if (queryState.specialization) {
            queryParts.push(queryState.specialization);
        }

        const fullQuery = queryParts.join(' ');
        currentSearchUrl = baseUrl + encodeURIComponent(fullQuery);
        return currentSearchUrl;
    };

    // --- 4. وظائف الثيم ---
    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme !== 'dark');
        localStorage.setItem('theme', theme);
        updateThemeButtonText();
    };

    const updateThemeButtonText = () => {
        const lang = localStorage.getItem('language') || 'ar';
        const theme = localStorage.getItem('theme') || 'light';
        const icon = toggleThemeBtn.querySelector('i');
        if (theme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            toggleThemeBtn.setAttribute('title', locales[lang].toggleThemeBtnKey); // "Switch to Dark Mode"
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            toggleThemeBtn.setAttribute('title', locales[lang].toggleThemeBtnKey); // "Switch to Light Mode"
        }
    };

    // --- 5. معالجات الأحداث ---

    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreenId = button.id.replace('nav-', '') + '-screen';
            screens.forEach(screen => screen.classList.remove('active'));
            document.getElementById(targetScreenId).classList.add('active');
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Specific actions for certain screens
            if (targetScreenId === 'history-screen') loadHistory();
            if (targetScreenId === 'favorites-screen') loadFavorites();
            // Hide results section when navigating away from home
            if (targetScreenId !== 'home-screen') {
                resultsSection.style.display = 'none';
            }
        });
    });

    // Main search button
    searchNowBtn.addEventListener('click', () => {
        updateQueryStateFromUI();
        if (!queryState.keywords) {
            alert(locales[localStorage.getItem('language') || 'ar'].queryEmpty);
            return;
        }
        const url = generateSearchUrl();
        window.open(url, '_blank'); // Open search in new tab
        saveToHistory(url); // Save to history
        simulateSearchResults(queryState.keywords); // Display simulated results
        resultsSection.style.display = 'grid'; // Show results section
    });

    // Apply Filters button (for results sidebar)
    applyFiltersBtn.addEventListener('click', () => {
        updateQueryStateFromUI(); // Update queryState with current filter values
        simulateSearchResults(queryState.keywords); // Re-simulate results with new filters
    });

    // Advanced options checkboxes (update query state on change)
    exactMatchCheckbox.addEventListener('change', updateQueryStateFromUI);
    excludeWordCheckbox.addEventListener('change', updateQueryStateFromUI);
    siteSearchCheckbox.addEventListener('change', updateQueryStateFromUI);

    // Filter selects (update query state on change)
    filetypeFilter.addEventListener('change', updateQueryStateFromUI);
    dateFilter.addEventListener('change', updateQueryStateFromUI);
    specializationFilter.addEventListener('change', updateQueryStateFromUI);

    // Theme toggle button
    toggleThemeBtn.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // Language select
    langSelect.addEventListener('change', () => setLanguage(langSelect.value));

    // Close modals
    closeBtns.forEach(btn => btn.addEventListener('click', () => favoriteNameModal.style.display = 'none'));
    window.addEventListener('click', (e) => {
        if (e.target === favoriteNameModal) favoriteNameModal.style.display = 'none';
    });

    // Add to Favorites button (will be added to result cards or a general action)
    // For now, let's assume a general "Add current query to favorites" button
    // This button is not explicitly in the new HTML, but we can add it to the results section or main search area if needed.
    // For this example, I'll add a placeholder for it.
    // If you want to add it, uncomment the following:
    /*
    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn'); // You need to add this button in HTML
    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener('click', () => {
            updateQueryStateFromUI();
            if (!queryState.keywords) {
                alert(locales[localStorage.getItem('language') || 'ar'].queryEmpty);
                return;
            }
            favoriteNameModal.style.display = 'flex';
            favoriteNameInput.focus();
        });
    }
    */

    // Save Favorite button
    saveFavoriteBtn.addEventListener('click', async () => {
        const name = favoriteNameInput.value.trim();
        if (!name) {
            alert(locales[localStorage.getItem('language') || 'ar'].favoriteNameMissing);
            return;
        }
        updateQueryStateFromUI(); // Ensure queryState is up-to-date
        const url = generateSearchUrl(); // Generate URL for saving
        await db.collection('Favorites').add({
            deviceId: deviceId,
            queryName: name,
            queryData: queryState,
            url: url,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        favoriteNameInput.value = '';
        favoriteNameModal.style.display = 'none';
        if (document.getElementById('favorites-screen').classList.contains('active')) loadFavorites();
    });

    // Clear History button
    clearHistoryBtn.addEventListener('click', async () => {
        if (confirm(locales[localStorage.getItem('language') || 'ar'].confirmClearHistory)) {
            const snapshot = await db.collection('Searches').where('deviceId', '==', deviceId).get();
            const batch = db.batch();
            snapshot.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            loadHistory();
        }
    });

    // --- 6. وظائف Firebase (History & Favorites) ---
    const saveToHistory = async (url) => {
        try {
            await db.collection('Searches').add({
                deviceId: deviceId,
                queryData: queryState,
                queryText: mainInput.value.trim(), // Save main keywords for display
                url: url,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error saving to history: ", error);
        }
    };

    const renderList = (element, docs, emptyKey, renderer) => {
        const lang = localStorage.getItem('language') || 'ar';
        if (docs.empty) {
            element.innerHTML = `<div class="list-item empty-list-message">${locales[lang][emptyKey]}</div>`;
            return;
        }
        element.innerHTML = '';
        docs.forEach(doc => renderer(doc, lang));
    };

    const loadHistory = async () => {
        const snapshot = await db.collection('Searches').where('deviceId', '==', deviceId).orderBy('createdAt', 'desc').limit(30).get();
        renderList(historyList, snapshot, 'historyEmpty', (doc, lang) => {
            const data = doc.data();
            const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString(lang) : '';
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <h4>${data.queryText || 'No Keywords'}</h4>
                <p class="meta-info">${date}</p>
                <div class="item-actions">
                    <button class="primary-btn small-btn" onclick="window.open('${data.url}', '_blank')">${locales[lang].reSearch}</button>
                    <button class="danger-btn small-btn delete-item" data-collection="Searches" data-id="${doc.id}">${locales[lang].delete}</button>
                </div>
            `;
            historyList.appendChild(item);
        });
    };

    const loadFavorites = async () => {
        const snapshot = await db.collection('Favorites').where('deviceId', '==', deviceId).orderBy('createdAt', 'desc').get();
        renderList(favoritesList, snapshot, 'favoritesEmpty', (doc, lang) => {
            const data = doc.data();
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <h4>${data.queryName}</h4>
                <p class="meta-info">${data.queryData.keywords || 'No Keywords'}</p>
                <div class="item-actions">
                    <button class="primary-btn small-btn apply-favorite" data-id="${doc.id}">${locales[lang].apply}</button>
                    <button class="danger-btn small-btn delete-item" data-collection="Favorites" data-id="${doc.id}">${locales[lang].delete}</button>
                </div>
            `;
            favoritesList.appendChild(item);
        });
    };

    document.addEventListener('click', async (e) => {
        const lang = localStorage.getItem('language') || 'ar';
        if (e.target.matches('.delete-item')) {
            if (confirm(locales[lang].confirmDelete)) {
                const { collection, id } = e.target.dataset;
                await db.collection(collection).doc(id).delete();
                if (collection === 'Searches') loadHistory();
                else loadFavorites();
            }
        }
        if (e.target.matches('.apply-favorite')) {
            const doc = await db.collection('Favorites').doc(e.target.dataset.id).get();
            if (doc.exists) {
                const data = doc.data();
                queryState = data.queryData; // Restore full query state
                mainInput.value = queryState.keywords || '';

                // Restore advanced options checkboxes
                exactMatchCheckbox.checked = queryState.exactMatch || false;
                excludeWordCheckbox.checked = !!queryState.excludeWord; // Check if a word was stored
                siteSearchCheckbox.checked = !!queryState.siteSearch; // Check if a site was stored

                // Restore filter values
                filetypeFilter.value = queryState.filetype || '';
                dateFilter.value = queryState.date || '';
                specializationFilter.value = queryState.specialization || '';

                // Navigate to home screen and show results
                document.getElementById('nav-home').click();
                simulateSearchResults(queryState.keywords); // Re-simulate results
                resultsSection.style.display = 'grid';
            }
        }
    });

    // --- 7. وظائف محاكاة النتائج (للتوضيح فقط) ---
    const simulateSearchResults = (keywords) => {
        searchResultsList.innerHTML = ''; // Clear previous results
        const lang = localStorage.getItem('language') || 'ar';

        // Show skeleton loaders
        for (let i = 0; i < 3; i++) { // Show 3 skeleton loaders
            const skeleton = document.createElement('div');
            skeleton.className = 'result-card skeleton-loader';
            skeleton.innerHTML = `
                <div class="skeleton-line title"></div>
                <div class="skeleton-line url"></div>
                <div class="skeleton-line snippet"></div>
                <div class="skeleton-line actions"></div>
            `;
            searchResultsList.appendChild(skeleton);
        }

        // Simulate API call delay
        setTimeout(() => {
            searchResultsList.innerHTML = ''; // Clear skeletons
            const dummyResults = [
                { title: `بحث متعمق في ${keywords}`, url: "https://example.com/doc1.pdf", snippet: "ملخص قصير يصف محتوى البحث، يظهر هنا لمساعدة المستخدم على فهم ما إذا كانت النتيجة ذات صلة.", filetype: "PDF" },
                { title: `دراسة حالة حول ${keywords} وتأثيرها`, url: "https://example.com/doc2.html", snippet: "ملخص قصير يصف محتوى البحث، يظهر هنا لمساعدة المستخدم على فهم ما إذا كانت النتيجة ذات صلة.", filetype: "HTML" },
                { title: `تحليل مقارن لـ ${keywords} في السياق الحديث`, url: "https://example.com/doc3.docx", snippet: "ملخص قصير يصف محتوى البحث، يظهر هنا لمساعدة المستخدم على فهم ما إذا كانت النتيجة ذات صلة.", filetype: "DOCX" },
                { title: `مراجعة أدبية لـ ${keywords} في السنوات الأخيرة`, url: "https://example.com/doc4.pdf", snippet: "ملخص قصير يصف محتوى البحث، يظهر هنا لمساعدة المستخدم على فهم ما إذا كانت النتيجة ذات صلة.", filetype: "PDF" },
            ];

            dummyResults.forEach(result => {
                const item = document.createElement('div');
                item.className = 'result-card';
                item.innerHTML = `
                    <h3 class="title"><a href="${result.url}" target="_blank">${result.title}</a></h3>
                    <p class="url"><i class="fas fa-link"></i> ${result.url}</p>
                    <p class="snippet">${result.snippet}</p>
                    <div class="actions">
                        <button onclick="window.open('${result.url}', '_blank')"><i class="fas fa-file-alt"></i> ${lang === 'ar' ? 'فتح' : 'Open'} ${result.filetype}</button>
                        <button><i class="fas fa-star"></i> ${lang === 'ar' ? 'حفظ' : 'Save'}</button>
                    </div>
                `;
                searchResultsList.appendChild(item);
            });
            loadMoreBtn.style.display = 'block'; // Show load more button
        }, 1000); // Simulate 1 second loading time
    };

    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more results
        simulateSearchResults(queryState.keywords); // Append more results
    });

    // --- 8. التهيئة الأولية ---
    const initialLang = localStorage.getItem('language') || 'ar';
    setLanguage(initialLang);
    const initialTheme = localStorage.getItem('theme') || 'light';
    applyTheme(initialTheme);

    // Initial load of history and favorites if their screens are active (though they start hidden)
    // They will be loaded when their respective nav buttons are clicked.
});
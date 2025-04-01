import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import authMiddleware from '../middleware/authMiddleware';
import { AuthRequest } from '../types/AuthRequest';

interface AnalyticsEvent {
    type: 'view_item' | 'search' | 'location_change' | 'view_screen';
    itemType?: string;
    itemId?: string;
    query?: string;
    latitude?: number;
    longitude?: number;
}

interface AreaVisited {
    name: string;
    lastVisited: string;
    frequency: number;
}

type ViewableField = 'viewedProducts' | 'viewedJobs' | 'viewedPosts' | 'consultations';

const router = express.Router();

const getItemTypeField = (itemType: string): ViewableField | null => {
    const typeMap: Record<string, ViewableField> = {
        product: 'viewedProducts',
        job: 'viewedJobs',
        post: 'viewedPosts',
        consultation: 'consultations'
    };

    return typeMap[itemType] || null;
};


// עדכון נתוני אנליטיקס של משתמש
router.post('/events', authMiddleware, async (req: any, res: any) => {
    try {
        const { userId, events, deviceInfo, sessionStart, sessionEnd } = req.body;

        // וודא שהמשתמש מעדכן את הנתונים שלו עצמו או שהוא מנהל
        if (!req.user || (req.user.id !== userId && req.user.role !== 'admin')) {
            return res.status(403).json({ message: 'אין הרשאה לעדכן נתוני אנליטיקס של משתמש אחר' });
        }

        // חשב משך סשן
        const sessionDuration = sessionStart && sessionEnd
            ? (new Date(sessionEnd).getTime() - new Date(sessionStart).getTime()) / 1000 // בשניות
            : 0;

        // קבל את המשתמש הנוכחי
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        // ⚙️ עדכן נתוני שימוש
        if (!user.get('appUsageStats')) {
            user.set('appUsageStats', {
                totalLogins: 1,
                averageSessionDuration: sessionDuration,
                lastActiveDate: new Date().toISOString()
            });
        } else {
            const appUsageStats = user.get('appUsageStats');
            if (appUsageStats && appUsageStats.lastActiveDate) {

                // חישוב ממוצע חדש אם יש משך סשן
                if (sessionDuration > 0) {
                    const oldAvg = appUsageStats?.averageSessionDuration || 0;
                    const totalSessions = appUsageStats?.totalLogins || 1;
                    appUsageStats.averageSessionDuration =
                        (oldAvg * (totalSessions - 1) + sessionDuration) / totalSessions;
                }




                appUsageStats.totalLogins = (appUsageStats?.totalLogins || 0) + 1;
                appUsageStats.lastActiveDate = new Date().toISOString();

                user.set('appUsageStats', appUsageStats);
            }
        }

        // עדכן נתונים נוספים על סמך האירועים
        if (events && events.length > 0) {
            for (const event of events) {
                switch (event.type) {
                    case 'view_item':
                        // עדכן פריטים שנצפו
                        const fieldName = getItemTypeField(event.itemType);
                        if (fieldName) {
                            const currentItems = user.get(fieldName) || [];
                            if (!currentItems.includes(event.itemId)) {
                                currentItems.push(event.itemId);
                                // שמור רק 100 הפריטים האחרונים
                                if (currentItems.length > 100) {
                                    user.set(fieldName, currentItems.slice(-100));
                                } else {
                                    user.set(fieldName, currentItems);
                                }
                            }
                        }
                        break;

                    case 'search':
                        // עדכן היסטוריית חיפושים
                        const recentSearches = user.get('recentSearches') || [];
                        if (!recentSearches.includes(event.query)) {
                            recentSearches.unshift(event.query);
                            // שמור רק 20 החיפושים האחרונים
                            user.set('recentSearches',
                                recentSearches.length > 20
                                    ? recentSearches.slice(0, 20)
                                    : recentSearches
                            );
                        }
                        break;

                    case 'location_change':
                        // עדכן אזורים שבוקרו
                        const areasVisited = user.get('areasVisited') as AreaVisited[];


                        // בדוק אם האזור כבר קיים (דיוק של כ-100 מטר)
                        const roundLat = Math.round((event.latitude || 0) * 1000) / 1000;
                        const roundLng = Math.round((event.longitude || 0) * 1000) / 1000;

                        const existingAreaIndex = areasVisited.findIndex(area => {
                            if (!area.name) return false;
                            const coords = area.name.split(',');
                            if (coords.length !== 2) return false;

                            const areaLat = Math.round(parseFloat(coords[0]) * 1000) / 1000;
                            const areaLng = Math.round(parseFloat(coords[1]) * 1000) / 1000;
                            return areaLat === roundLat && areaLng === roundLng;
                        });

                        if (existingAreaIndex >= 0) {
                            // עדכן אזור קיים
                            areasVisited[existingAreaIndex].lastVisited = new Date().toISOString();
                            areasVisited[existingAreaIndex].frequency += 1;
                        } else {
                            // הוסף אזור חדש
                            areasVisited.push({
                                name: `${event.latitude},${event.longitude}`,
                                lastVisited: new Date().toISOString(),
                                frequency: 1
                            });

                            // שמור רק 10 האזורים המבוקרים ביותר
                            if (areasVisited.length > 10) {
                                areasVisited.sort((a, b) => b.frequency - a.frequency);
                                user.set('areasVisited', areasVisited.slice(0, 10));
                            } else {
                                user.set('areasVisited', areasVisited);
                            }
                        }
                        break;

                    case 'view_screen':
                        // עדכן שעות פעילות מועדפות
                        const currentHour = new Date().getHours();
                        let mostActiveHours = user.get('mostActiveHours') || Array(24).fill(0);
                        mostActiveHours[currentHour] = (mostActiveHours[currentHour] || 0) + 1;
                        user.set('mostActiveHours', mostActiveHours);

                        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const currentDay = dayNames[new Date().getDay()];
                        let mostActiveDays = user.get('mostActiveDays') || [];

                        if (!mostActiveDays.includes(currentDay)) {
                            mostActiveDays.push(currentDay);
                            user.set('mostActiveDays', mostActiveDays);
                        }
                        break;
                }
            }
        }

        // שמור את השינויים
        await user.save();

        return res.status(200).json({ message: 'נתוני אנליטיקס עודכנו בהצלחה' });
    } catch (error) {
        console.error('❌ שגיאה בעדכון נתוני אנליטיקס:', error);
        return res.status(500).json({ message: 'שגיאת שרת בעדכון נתוני אנליטיקס' });
    }
});

// קבלת נתוני אנליטיקס של משתמש
router.get('/user/:userId', authMiddleware, async (req: any, res: any) => {
    try {
        // וודא שהמשתמש מבקש את המידע על עצמו או שהוא מנהל
        if (!req.user || (req.params.userId !== req.user.id && req.user.role !== 'admin')) {
            return res.status(403).json({ message: 'אין הרשאה לצפות בנתוני אנליטיקס של משתמש אחר' });
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        // החזר נתוני אנליטיקס
        const analytics = {
            appUsageStats: user.get('appUsageStats') || {},
            areasVisited: user.get('areasVisited') || [],
            mostActiveHours: user.get('mostActiveHours') || [],
            mostActiveDays: user.get('mostActiveDays') || [],
            recentSearches: user.get('recentSearches') || [],
            // לא כולל מידע רגיש
        };

        return res.status(200).json(analytics);
    } catch (error) {
        console.error('❌ שגיאה בקבלת נתוני אנליטיקס:', error);
        return res.status(500).json({ message: 'שגיאת שרת בקבלת נתוני אנליטיקס' });
    }
});

export default router;
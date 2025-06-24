import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/api/entities';
import { User } from '@/api/entities';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const userNotifications = await Notification.filter(
        { user_email: user.email }, 
        '-created_date', 
        50
      );
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
    setIsLoading(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      await Notification.update(notificationId, { is_read: true });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n => Notification.update(n.id, { is_read: true }))
      );
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await Notification.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const getIcon = (type) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-400" />,
      error: <AlertCircle className="w-5 h-5 text-red-400" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      info: <Info className="w-5 h-5 text-blue-400" />,
      system: <Bell className="w-5 h-5 text-purple-400" />,
    };
    return icons[type] || icons.info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-500',
      medium: 'bg-blue-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500',
    };
    return colors[priority] || colors.medium;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Carregando notificações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Central de Notificações
            </CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} não lidas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
              <Eye className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhuma notificação</h3>
            <p className="text-gray-500">Você está em dia com tudo!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg border transition-all hover:bg-gray-700/30 ${
                    notification.is_read 
                      ? 'bg-gray-700/20 border-gray-600' 
                      : 'bg-gray-700/40 border-blue-500/30 shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-semibold ${notification.is_read ? 'text-gray-300' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(notification.priority)} size="sm">
                            {notification.priority}
                          </Badge>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${notification.is_read ? 'text-gray-400' : 'text-gray-200'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_date).toLocaleString('pt-BR')}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.action_url && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                            >
                              {notification.action_label || 'Ver mais'}
                            </Button>
                          )}
                          {!notification.is_read && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
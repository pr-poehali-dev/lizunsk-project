import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

function Index() {
  const [lizcoin, setLizcoin] = useState(100);
  const [activeSection, setActiveSection] = useState('main');
  const [crosswordAnswers, setCrosswordAnswers] = useState<Record<string, string>>({});
  const [completedCrosswords, setCompletedCrosswords] = useState<string[]>([]);

  const crosswordWords = [
    { id: 'word1', clue: 'Главная достопримечательность города', answer: 'лизун', length: 5 },
    { id: 'word2', clue: 'Холодное лакомство', answer: 'мороженое', length: 9 },
    { id: 'word3', clue: 'Фруктовый лед', answer: 'сорбет', length: 6 },
    { id: 'word4', clue: 'Часть тела для объятий', answer: 'ладошка', length: 7 },
    { id: 'word5', clue: 'Летний суп', answer: 'окрошка', length: 7 },
    { id: 'word6', clue: 'Певчая птица', answer: 'соловей', length: 7 },
    { id: 'word7', clue: 'Молочное животное', answer: 'корова', length: 6 },
    { id: 'word8', clue: 'Женское имя', answer: 'лиза', length: 4 },
    { id: 'word9', clue: 'Глава государства', answer: 'президент', length: 9 }
  ];

  const shopItems = [
    { id: 'passport', name: 'Паспорт Лизунска', price: 500, emoji: '📄' },
    { id: 'moon-passport', name: 'Лунный паспорт', price: 50000, emoji: '🌙', limited: true, stock: 2 },
    { id: 'signature', name: 'Подпись от президента', price: 2400, emoji: '✍️' },
    { id: 'statue', name: 'Фигурка статуи Лизы Свободы', price: 1800, emoji: '🗽' }
  ];

  const checkCrosswordAnswer = (wordId: string, answer: string) => {
    const word = crosswordWords.find(w => w.id === wordId);
    if (word && answer.toLowerCase() === word.answer.toLowerCase()) {
      if (!completedCrosswords.includes(wordId)) {
        setLizcoin(prev => prev + 25);
        setCompletedCrosswords(prev => [...prev, wordId]);
      }
      return true;
    }
    return false;
  };

  const buyItem = (item: any) => {
    if (lizcoin >= item.price) {
      setLizcoin(prev => prev - item.price);
      alert(`Вы купили ${item.name}! 🎉`);
    } else {
      alert('Недостаточно лизкоинов! 💰');
    }
  };

  const renderMainSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background text-foreground">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 gradient-text animate-fade-in">
            🍭 ЛИЗУНСК 🍭
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Добро пожаловать в виртуальный город сладких приключений!
          </p>
          
          <div className="flex justify-center items-center gap-4 mb-8">
            <Badge variant="outline" className="text-lg px-4 py-2 hover-scale">
              <Icon name="Coins" size={20} className="mr-2" />
              {lizcoin} лизкоинов
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'history', title: 'История города', emoji: '📚', desc: 'Узнайте о происхождении Лизунска' },
            { id: 'shop', title: 'Магазин', emoji: '🛒', desc: 'Покупайте уникальные товары за лизкоины' },
            { id: 'attractions', title: 'Достопримечательности', emoji: '🏛️', desc: 'Исследуйте памятники города' },
            { id: 'quests', title: 'Квесты', emoji: '🎯', desc: 'Зарабатывайте лизкоины за кроссворды' }
          ].map(section => (
            <Card 
              key={section.id}
              className="hover-scale cursor-pointer bg-card/80 backdrop-blur-sm border-2 hover:border-primary transition-all duration-300"
              onClick={() => setActiveSection(section.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{section.emoji}</div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">{section.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistorySection = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">📚 История Лизунска</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Лизунск был основан в далеком 1847 году группой мороженщиков, искавших идеальное место 
              для создания самых вкусных лакомств в мире.
            </p>
            <p>
              Город получил свое название в честь легендарного лизуна - мифического существа, 
              которое, согласно местным легендам, охраняло секретные рецепты мороженого.
            </p>
            <p>
              Сегодня Лизунск известен как столица сладостей, где каждый житель является мастером 
              создания уникальных вкусов и текстур.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderShopSection = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">🛒 Магазин Лизунска</CardTitle>
            <p className="text-muted-foreground">
              Ваш баланс: <span className="text-primary font-bold">{lizcoin} лизкоинов</span>
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopItems.map(item => (
                <Card key={item.id} className="hover-scale border-2 hover:border-primary transition-all">
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.limited && (
                        <Badge variant="destructive" className="mt-2">
                          Лимитированная версия ({item.stock} шт.)
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-2xl font-bold text-primary mb-4">
                      {item.price.toLocaleString()} 🪙
                    </p>
                    <Button 
                      onClick={() => buyItem(item)}
                      disabled={lizcoin < item.price}
                      className="w-full hover-scale"
                    >
                      Купить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAttractionsSection = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">🏛️ Достопримечательности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Статуя Лизы Свободы', emoji: '🗽', desc: 'Главный символ города, держащий рожок мороженого' },
                { name: 'Музей Мороженого', emoji: '🍦', desc: 'Крупнейшая коллекция рецептов и артефактов' },
                { name: 'Парк Сладких Грез', emoji: '🌸', desc: 'Место отдыха с фонтанами из сиропа' },
                { name: 'Мост Лизунов', emoji: '🌉', desc: 'Уникальный мост в форме растянутого лизуна' }
              ].map(attraction => (
                <Card key={attraction.name} className="hover-scale">
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{attraction.emoji}</div>
                      <CardTitle>{attraction.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">{attraction.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderQuestsSection = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">🎯 Кроссворды</CardTitle>
            <p className="text-muted-foreground">
              Решайте кроссворды и получайте по 25 лизкоинов за каждый правильный ответ!
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crosswordWords.map(word => (
                <Card 
                  key={word.id} 
                  className={`hover-scale ${completedCrosswords.includes(word.id) ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {completedCrosswords.includes(word.id) ? '✅' : '❓'} Слово {word.length} букв
                    </CardTitle>
                    <p className="text-muted-foreground">{word.clue}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите ответ"
                        value={crosswordAnswers[word.id] || ''}
                        onChange={(e) => setCrosswordAnswers(prev => ({
                          ...prev,
                          [word.id]: e.target.value
                        }))}
                        disabled={completedCrosswords.includes(word.id)}
                      />
                      <Button
                        onClick={() => checkCrosswordAnswer(word.id, crosswordAnswers[word.id] || '')}
                        disabled={completedCrosswords.includes(word.id)}
                        className="hover-scale"
                      >
                        {completedCrosswords.includes(word.id) ? '✅' : 'Проверить'}
                      </Button>
                    </div>
                    {completedCrosswords.includes(word.id) && (
                      <Badge variant="default" className="mt-2">
                        +25 лизкоинов получено!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background dark">
      {activeSection === 'main' && renderMainSection()}
      {activeSection === 'history' && renderHistorySection()}
      {activeSection === 'shop' && renderShopSection()}
      {activeSection === 'attractions' && renderAttractionsSection()}
      {activeSection === 'quests' && renderQuestsSection()}
    </div>
  );
}

export default Index;
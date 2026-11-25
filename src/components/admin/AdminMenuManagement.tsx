import { useState } from 'react';
import {
  ChefHat,
  Edit2,
  Flame,
  Plus,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DishItem, MealType } from '../../types';

export function AdminMenuManagement() {
  const { state, addDish, editDish, removeDish } = useApp();
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Lunch');
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<DishItem['category']>('Main');
  const [formDiet, setFormDiet] = useState<DishItem['diet']>('Veg');
  const [formPortionGrams, setFormPortionGrams] = useState(180);
  const [formCalories, setFormCalories] = useState(250);

  const messId = state.adminSelectedMessId;
  const mess = state.messes[messId];

  const dishes = state.dishes.filter(
    (d) => d.messId === messId && d.meal === selectedMeal
  );

  const openAddModal = () => {
    setFormName('');
    setFormCategory('Main');
    setFormDiet('Veg');
    setFormPortionGrams(180);
    setFormCalories(250);
    setIsAdding(true);
    setEditingDish(null);
  };

  const openEditModal = (dish: DishItem) => {
    setFormName(dish.name);
    setFormCategory(dish.category);
    setFormDiet(dish.diet);
    setFormPortionGrams(dish.standardPortionGrams);
    setFormCalories(dish.calories || 200);
    setEditingDish(dish);
    setIsAdding(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingDish) {
      editDish({
        ...editingDish,
        name: formName.trim(),
        category: formCategory,
        diet: formDiet,
        standardPortionGrams: Number(formPortionGrams),
        calories: Number(formCalories),
      });
      setEditingDish(null);
    } else {
      addDish({
        messId,
        meal: selectedMeal,
        name: formName.trim(),
        category: formCategory,
        diet: formDiet,
        standardPortionGrams: Number(formPortionGrams),
        calories: Number(formCalories),
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Menu & Recipe Database</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {mess.name}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Menu Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add, update, or remove dishes for each meal. Changes update student pre-commitment views immediately.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Meal Toggle */}
          <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-bold">
            {(['Lunch', 'Dinner'] as MealType[]).map((meal) => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                  selectedMeal === meal
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{meal}</span>
              </button>
            ))}
          </div>

          <button
            onClick={openAddModal}
            className="rounded-xl bg-blue-600 text-white px-3.5 py-2 text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="size-3.5" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Current {selectedMeal} Dishes ({dishes.length} Items)
          </h2>
          <span className="text-xs text-slate-400">
            Synced live with Student Menu screen
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Dish Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Dietary Tag</th>
                <th className="pb-3 font-mono">Standard Serving</th>
                <th className="pb-3 font-mono">Nutrition</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dishes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No dishes listed for this meal. Tap "Add New Dish" above.
                  </td>
                </tr>
              ) : (
                dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {dish.name}
                    </td>

                    <td className="py-3">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {dish.category}
                      </span>
                    </td>

                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dish.diet === 'Veg'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : dish.diet === 'Non-Veg'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        }`}
                      >
                        {dish.diet}
                      </span>
                    </td>

                    <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {dish.standardPortionGrams}g
                    </td>

                    <td className="py-3 font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Flame className="size-3 text-amber-500" />
                      <span>{dish.calories || 200} kcal</span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(dish)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Dish"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => removeDish(dish.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {(isAdding || editingDish) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ChefHat className="size-5 text-blue-600" />
                {editingDish ? 'Edit Dish' : 'Add New Dish to Menu'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingDish(null);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Malai Kofta Curry"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as DishItem['category'])
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Main">Main</option>
                    <option value="Dal">Dal</option>
                    <option value="Rice">Rice</option>
                    <option value="Bread">Bread</option>
                    <option value="Side">Side</option>
                    <option value="Sweet">Sweet</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Diet Tag
                  </label>
                  <select
                    value={formDiet}
                    onChange={(e) =>
                      setFormDiet(e.target.value as DishItem['diet'])
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Serving Weight (Grams)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="1000"
                    value={formPortionGrams}
                    onChange={(e) => setFormPortionGrams(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={formCalories}
                    onChange={(e) => setFormCalories(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingDish(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

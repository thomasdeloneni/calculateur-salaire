'use client';

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function CalculateurSalaire() {
  const [joursPresence, setJoursPresence] = useState('');
  const [inclureFreais, setInclureFreais] = useState(true);
  const [resultats, setResultats] = useState(null);

  const calculerSalaire = () => {
    const jours = parseFloat(joursPresence);
    
    if (isNaN(jours) || jours < 0) {
      alert('Veuillez entrer un nombre de jours valide');
      return;
    }

    // Calcul 1: jours × 4,22 × 9,5
    const calcul1 = jours * 4.22 * 9.5;
    
    // Calcul 2: jours × 3,69 (seulement si inclus)
    const calcul2 = inclureFreais ? jours * 3.69 : 0;
    
    // Total
    const total = calcul1 + calcul2;

    setResultats({
      calcul1: calcul1.toFixed(2),
      calcul2: calcul2.toFixed(2),
      total: total.toFixed(2),
      inclureFreais: inclureFreais
    });
  };

  const reinitialiser = () => {
    setJoursPresence('');
    setResultats(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Calculator className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Calculateur de Salaire
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Assistante maternelle
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de jours de présence
            </label>
            <input
              type="number"
              step="0.01"
              value={joursPresence}
              onChange={(e) => setJoursPresence(e.target.value)}
              placeholder="Ex: 20"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex items-center space-x-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <input
              type="checkbox"
              id="inclureFreais"
              checked={inclureFreais}
              onChange={(e) => setInclureFreais(e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="inclureFreais" className="text-sm text-gray-700 cursor-pointer">
              Inclure les frais (× 3,69)
              <span className="block text-xs text-gray-500 mt-1">
                Décocher pour les périodes de congés
              </span>
            </label>
          </div>

          <button
            onClick={calculerSalaire}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Calculer
          </button>

          {resultats && (
            <div className="mt-6 space-y-4 bg-gray-50 p-6 rounded-xl">
              <h2 className="font-semibold text-gray-800 mb-4">Résultats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    {joursPresence} × 4,22 × 9,5
                  </span>
                  <span className="font-semibold text-gray-800">
                    {resultats.calcul1} €
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    {joursPresence} × 3,69
                    {!resultats.inclureFreais && (
                      <span className="ml-2 text-xs text-amber-600 font-medium">
                        (non inclus)
                      </span>
                    )}
                  </span>
                  <span className={`font-semibold ${resultats.inclureFreais ? 'text-gray-800' : 'text-gray-400'}`}>
                    {resultats.calcul2} €
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 pt-4">
                  <span className="font-bold text-gray-800">
                    Total à saisir
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {resultats.total} €
                  </span>
                </div>
              </div>

              <button
                onClick={reinitialiser}
                className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Nouveau calcul
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Calcul automatique du salaire mensuel
          </p>
        </div>
      </div>
    </div>
  );
}

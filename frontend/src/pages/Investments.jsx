import { useState } from 'react';
import { useSelector } from 'react-redux';
import { investmentService } from '../services/investmentService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calculator, DollarSign } from 'lucide-react';

const Investments = () => {
  const { user } = useSelector((state) => state.auth);
  const [investmentType, setInvestmentType] = useState('SIP');
  const [principal, setPrincipal] = useState(1000);
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const data = await investmentService.calculate({
        type: investmentType,
        principal: investmentType === 'FD' ? principal : 0,
        monthlyAmount: investmentType === 'SIP' || investmentType === 'PPF' ? monthlyAmount : 0,
        rate,
        years,
      });
      setResult(data);
    } catch (error) {
      console.error('Failed to calculate:', error);
      alert('Failed to calculate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Investment Calculator</h1>
        <p className="text-gray-600">Calculate returns for FD, SIP, and PPF</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calculator */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <span>Input Parameters</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Investment Type</label>
              <select
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="FD">Fixed Deposit (FD)</option>
                <option value="SIP">Systematic Investment Plan (SIP)</option>
                <option value="PPF">Public Provident Fund (PPF)</option>
              </select>
            </div>

            {investmentType === 'FD' ? (
              <div>
                <label className="block text-sm font-semibold mb-2">Principal Amount (₹)</label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1000"
                  step="1000"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2">Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="500"
                  step="500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Expected Annual Rate (%)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
                max="20"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Investment Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
                max={investmentType === 'PPF' ? 15 : 30}
                step="1"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span>Results</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Invested</div>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{result.totalInvested?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Returns</div>
                <div className="text-2xl font-bold text-green-600">
                  ₹{result.totalReturns?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Maturity Amount</div>
                <div className="text-2xl font-bold text-purple-600">
                  ₹{result.maturityAmount?.toLocaleString('en-IN')}
                </div>
              </div>

              {result.projections && result.projections.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Growth Projection</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Amount (₹)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold mb-2">💡 Investment Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Start investing early to benefit from compounding</li>
          <li>SIP is great for disciplined long-term wealth creation</li>
          <li>FD provides guaranteed returns but lower growth</li>
          <li>PPF offers tax benefits and long-term savings</li>
          <li>Diversify your investments across different asset classes</li>
        </ul>
      </div>
    </div>
  );
};

export default Investments;


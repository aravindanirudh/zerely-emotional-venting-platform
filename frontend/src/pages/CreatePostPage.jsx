import { useState } from 'react'; // React hook managing component state
import { useNavigate } from 'react-router-dom'; // React Router hook for programmatic navigation
import { useAuth } from '../context/AuthContext'; // Custom hook to access authentication context (current user info)
import { postService } from '../services/postService'; // Service module for handling API calls related to posts (e.g., creating a new post)
import MoodSelector, { MOODS } from '../components/posts/MoodSelector'; // Custom component for selecting a mood, along with a constant array of mood options
import { toast } from 'sonner';  // Library for showing toast notifications to the user (e.g., success or error messages)
import { Loader2, ArrowLeft } from 'lucide-react'; // Icon components from the Lucide icon library, used for showing a loading spinner and a back arrow in the UI
import { Link } from 'react-router-dom'; // React Router component for creating links that navigate to different routes in the application (for example, "Back to Wall" link)

const CreatePostPage = () => {
  const navigate = useNavigate(); // Hook for navigating to different routes programmatically (for example used after successful post creation to go back to the wall)
  const { user } = useAuth(); // Current authenticated user object extracted from AuthContext
  const [loading, setLoading] = useState(false); // State variable to track whether the form submission is in progress, used to disable the submit button and show a loading spinner
  // State variable to hold the form data for creating a new post, including title, content, selected mood, and auto-delete settings
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    autoDelete: {
      enabled: false,
      hours: 24
    }
  });

  // Function to handle form submission when the user tries to create a new post. It validates the input, sends the data to the server, and handles success or error responses.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (which would cause a page reload)
    // Validation: Ensure that the user has selected a mood before allowing the post to be created. If no mood is selected, show an error toast and stop the submission process.
    if (!formData.mood) { 
      return toast.error('Please select a mood that represents how you feel');
    }
    
    // Set loading state to true to indicate that the form submission is in progress, which can be used to disable the submit button and show a loading spinner
    setLoading(true);
    try {
      // Make an API call to create a new post using the postService. The formData is spread into the request body, and the autoDelete field is conditionally included only if it is enabled.
      const response = await postService.createPost({
        ...formData,
        autoDelete: formData.autoDelete.enabled ? formData.autoDelete : undefined
      });
      
      toast.success(response.message || 'Post created successfully');
      navigate('/wall');
    } catch (error) {
       toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false); // Reset loading state to false after the API call is completed, regardless of success or failure (finally block ensures this runs irrespective of whether an error occurred or if the request was successful)
    }
  };

  // Determine the color associated with the selected mood to style the mood selector or other UI elements accordingly. It looks up the selected mood in the MOODS array and retrieves its color, defaulting to a gray color if no mood is selected.
  // '?.' is optional chaining, which safely accesses the color property of the mood object if it exists, and if not, it will return undefined, allowing the fallback to 'text-gray-500' to be used.
  const selectedMoodColor = MOODS.find(m => m.id === formData.mood)?.color || 'text-gray-500';

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Link to wall after posting */}
      <Link to="/wall" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Wall
      </Link>

      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Vent your feelings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling right now?
            </label>
            <MoodSelector 
              selectedMood={formData.mood} 
              onSelect={(id) => setFormData({ ...formData, mood: id })} 
            />
          </div>

          {/* Title (Optional) */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Give your vent a headline..."
              maxLength={200}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What's on your mind?
            </label>
            <textarea
              id="content"
              rows={8}
              required
              minLength={10}
              maxLength={5000}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-field resize-none"
              placeholder="Let it all out... (Minimum 10 characters)"
            />
            <div className="flex justify-end mt-1 text-xs text-gray-400">
              {formData.content.length}/5000
            </div>
          </div>

          {/* Auto-delete settings */}
          <div className="bg-gray-50 dark:bg-dark-hover p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-black dark:text-white">Auto-delete post</h3>
                <p className="text-xs text-gray-500">Automatically remove this post after a set time.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.autoDelete.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoDelete: { ...formData.autoDelete, enabled: e.target.checked }
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
              </label>
            </div>

            {formData.autoDelete.enabled && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-black dark:text-gray-300 mb-2">
                  Delete after:
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {[1, 6, 12, 24, 48, 168].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        autoDelete: { ...formData.autoDelete, hours }
                      })}
                      className={`px-3 py-2 text-xs font-medium rounded-md border ${
                        formData.autoDelete.hours === hours
                          ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                          : 'bg-white border-gray-300 text-black hover:bg-gray-100 dark:bg-dark-card dark:border-dark-border dark:text-gray-300 dark:hover:bg-dark-hover'
                      }`}
                    >
                      {hours >= 24 ? `${hours/24} day${hours/24 > 1 ? 's' : ''}` : `${hours}h`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
             <button
               type="submit"
               disabled={loading}
               className="w-full flex justify-center py-3 px-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
               {loading ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 'Post Anonymously'
               )}
             </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              You'll earn 5 tokens for this post!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;

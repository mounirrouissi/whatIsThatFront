import { createContext, useContext, useEffect } from 'react';
import { client } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import { Species, Identification, Fact } from '@/types/enums';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const USERS_TABLE = 'users';
export const IDENTIFICATIONS_TABLE = 'identifications';
export const SPECIES_TABLE = 'species';
export const USER_FAVORITES_TABLE = 'user_favorites';
export const FACTS_TABLE = 'facts';
export const ENCYCLOPEDIA_TABLE = 'encyclopedia_entries';
const CATEGORIES_TABLE = 'categories';

export const FACTS_ENTRIES_TABLE = 'encyclopedia_facts';

type ProviderProps = {
  userId: string | null;
  createIdentification: (userId: string, imageUrl: string, speciesId: string | null, type: string,resemblance_rank:number,original_image_url:string) => Promise<any>;
  getIdentifications: (userId: string) => Promise<any>;
  getIdentificationInfo: (identificationId: string) => Promise<any>;
  getIdentificationByCategory: (userId: string,category:string) => Promise<any>;

  updateIdentification: (identification: Identification) => Promise<any>;
  deleteIdentification: (id: string) => Promise<any>;
  getSpecies: () => Promise<any>;
  addSpecies: (scientificName: string, commonName: string, category: string, description: string, habitat: string) => Promise<any>;
  updateSpecies: (species: Species) => Promise<any>;
  deleteSpecies: (id: string) => Promise<any>;
  getFavorites: (userId: string) => Promise<any>;
  addFavorite: (userId: string, speciesId: string) => Promise<any>;
  removeFavorite: (userId: string, speciesId: string) => Promise<any>;
  getFacts: (identificationId: string) => Promise<any>;
  addFact: (identificationId: string, fact: string, factNumber: number) => Promise<any>;
  updateFact: (fact: Fact) => Promise<any>;
  deleteFact: (id: string) => Promise<any>;
  getUserById: (userId: string) => Promise<any>;
  insertUser: (userId: string, email: string) => Promise<any>;
   // New methods
   fetchEncyclopediaEntriesByCategory: (category: string) => Promise<any>;
   fetchFactsByEncyclopediaEntryId: (encyclopediaEntryId: string) => Promise<any>;
};

const SupabaseContext = createContext<Partial<ProviderProps>>({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }: any) => {
  const { userId } = useAuth();
  console.log("at the supabse provider level the user I dd =="+userId);

  useEffect(() => {
    setRealtimeAuth();
  }, []);

  const setRealtimeAuth = async () => {
    const clerkToken = await window.Clerk?.session?.getToken({
      template: 'supabase',
    });

    if (clerkToken) {
      client.realtime.setAuth(clerkToken);
    }
  };

  const createIdentification = async (userId: string, imageUrl: string, speciesId: string, type: string,resemblance_rank:number,original_image_url:string) => {
    const { data, error } = await client
      .from(IDENTIFICATIONS_TABLE)
      .insert({ user_id: userId, image_url: imageUrl, species_id: speciesId, type,resemblance_rank,original_image_url })
      .select();

    if (error) {
      console.error('Error creating identification:', error);
      return error
    }

    return data;
  };

  const getIdentifications = async (userId: string) => {
    const { data } = await client
      .from(IDENTIFICATIONS_TABLE)
      .select('*')
      .eq('user_id', userId);

    return data || [];
  };

  const getIdentificationByCategory = async (userId: string, category: string) => {
    const { data,error } = await client
    .from(IDENTIFICATIONS_TABLE)
    .select('*')
    .eq('type', category)
    .order('identified_at', { ascending: false });
    if (error) {
      console.error(`Error fetching data for category ${category}:`, error);
      throw error;
    }
    return data;
  };
  const getIdentificationInfo = async (identificationId: string) => {
    const { data } = await client
      .from(IDENTIFICATIONS_TABLE)
      .select(`*, species (*)`)
      .match({ id: identificationId })
      .single();
    return data;
  };

  const updateIdentification = async (identification: Identification) => {
    const { data } = await client
      .from(IDENTIFICATIONS_TABLE)
      .update(identification)
      .match({ id: identification.id })
      .select('*')
      .single();

    return data;
  };

  const deleteIdentification = async (id: string) => {
    return await client.from(IDENTIFICATIONS_TABLE).delete().match({ id });
  };

  const getSpecies = async () => {
    const { data } = await client
      .from(SPECIES_TABLE)
      .select('*');
    
    return data || [];
  };

  const addSpecies = async (scientificName: string, commonName: string, category: string, description: string, habitat: string) => {
    return await client
      .from(SPECIES_TABLE)
      .insert({ scientific_name: scientificName, common_name: commonName, category, description, habitat })
      .select('*')
      .single();
  };

  const updateSpecies = async (species: Species) => {
    return await client
      .from(SPECIES_TABLE)
      .update(species)
      .match({ id: species.id });
  };

  const deleteSpecies = async (id: string) => {
    return await client.from(SPECIES_TABLE).delete().match({ id: id });
  };

  const getFavorites = async (userId: string) => {
    const { data } = await client
      .from(USER_FAVORITES_TABLE)
      .select(`*, species (*)`)
      .eq('user_id', userId);

    return data || [];
  };

  const addFavorite = async (userId: string, speciesId: string) => {
    return await client
      .from(USER_FAVORITES_TABLE)
      .insert({ user_id: userId, species_id: speciesId });
  };

  const removeFavorite = async (userId: string, speciesId: string) => {
    return await client
      .from(USER_FAVORITES_TABLE)
      .delete()
      .match({ user_id: userId, species_id: speciesId });
  };

  const getFacts = async (identificationId: string) => {
    const { data } = await client
      .from(FACTS_TABLE)
      .select('*')
      .eq('identification_id', identificationId);

    return data || [];
  };

  const addFact = async (identificationId: string, fact: string, factNumber: number) => {
    return await client
      .from(FACTS_TABLE)
      .insert({ identification_id: identificationId, fact, fact_number: factNumber })
      .select('*')
      .single();
  };

  const updateFact = async (fact: Fact) => {
    return await client
      .from(FACTS_TABLE)
      .update(fact)
      .match({ id: fact.id });
  };

  const deleteFact = async (id: string) => {
    return await client.from(FACTS_TABLE).delete().match({ id: id });
  };

  const getUserById = async (userId: string) => {
    console.log("getting user with id "+userId);
    const { data, error } = await client
      .from(USERS_TABLE)
      .select('*')
      .eq('id', userId)
      .single();
  
    if (error) {
      if (error.code === 'PGRST116') {
        // User not found
        return null;
      }
      console.error('Error getting user:', error);
      throw error;
    }
  
    return data;
  };

  const insertUser = async (userId: string, email: string) => {
    console.log("INSERTING user with id "+userId);
    const { data, error } = await client
      .from(USERS_TABLE)
      .insert({ id: userId, email })
      .select('*')
      .single();

    if (error) {
      console.error('Error inserting user:', error);
    }

    return data;
  };

  const fetchEncyclopediaEntriesByCategory = async (categoryName: string) => {
    try {
      const { data, error } = await client
        .from('categories')
        .select(`
          id,
          name,
          encyclopedia_entries (
            name,
            description,
            image_url,
            created_at
          )
        `)
        .eq('name', categoryName)
        .single();
  
      if (error) {
        throw error;
      }
  
      console.log("Fetched data:", data);
      return data.encyclopedia_entries;
    } catch (error) {
      console.error('Error fetching encyclopedia entries:', error);
      throw error;
    }
  };

  const fetchFactsByEncyclopediaEntryId = async (encyclopediaEntryId: string) => {
    const { data, error } = await client
      .from(FACTS_ENTRIES_TABLE)
      .select('*')
      .eq('entry_id', encyclopediaEntryId);


    if (error) {
      console.error(`Error fetching facts for encyclopedia entry ID ${encyclopediaEntryId}:`, error);
      throw error;
    }

    return data || [];
  };
  const value = {
    userId,
    createIdentification,
    getIdentifications,
    getIdentificationInfo,
    updateIdentification,
    deleteIdentification,
    getSpecies,
    addSpecies,
    updateSpecies,
    deleteSpecies,
    getFavorites,
    addFavorite,
    removeFavorite,
    getFacts,
    addFact,
    updateFact,
    deleteFact,
    getUserById,
    insertUser,
     // New methods
     fetchEncyclopediaEntriesByCategory,
     fetchFactsByEncyclopediaEntryId,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};
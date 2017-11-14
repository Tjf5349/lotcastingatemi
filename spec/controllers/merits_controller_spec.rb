# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::MeritsController, type: :controller do
  def authenticated_header(user)
    token = Knock::AuthToken.new(payload: { sub: user.id }).token
    "Bearer #{token}"
  end

  before(:each) do
    @player = FactoryBot.create(:player)
    @character = FactoryBot.create(:character, player_id: @player.id)
    @merit = FactoryBot.create(:merit, character_id: @character.id)
  end

  describe 'GET #show' do
    it 'returns http success' do
      request.headers['Authorization'] = authenticated_header(@player)
      get :show, params: { character_id: @merit.character_id, id: @merit.id, format: :json }

      expect(response).to have_http_status(:success)
    end

    it_behaves_like 'respond_to_unauthenticated', 'show'
  end

  describe 'POST #create' do
    context 'With valid attributes' do
      it 'Increases merit count by 1' do
        request.headers['Authorization'] = authenticated_header(@player)
        @merit_params = FactoryBot.attributes_for(:merit, character_id: @character.id)

        expect { post :create, params: { character_id: @character.id, merit: @merit_params }, format: :json }.to change(Merit, :count).by(1)
      end
    end

    context 'With invalid attributes' do
      it 'Increases merit count by 0' do
        request.headers['Authorization'] = authenticated_header(@player)
        @invalid_merit_params = FactoryBot.attributes_for(:merit, rating: 9)

        expect { post :create, params: { character_id: @character.id, merit: @invalid_merit_params }, format: :json }.to change(Merit, :count).by(0)
      end
    end

    it_behaves_like 'respond_to_unauthenticated', 'create'
  end

  describe 'DELETE #destroy' do
    it 'Decreases merit count by 1' do
      request.headers['Authorization'] = authenticated_header(@player)

      expect { delete :destroy, params: { character_id: @merit.character_id, id: @merit.id, format: :json } }.to change(Merit, :count).by(-1)
    end

    it_behaves_like 'respond_to_unauthenticated', 'destroy'
  end

  describe 'PATCH #update' do
    context 'With valid attributes' do
      it 'Updates merit attributes' do
        request.headers['Authorization'] = authenticated_header(@player)
        @updated_merit_params = FactoryBot.attributes_for(:merit, character_id: @character.id, merit_cat: 'innate')

        expect(@merit.merit_cat).to eq('story')

        patch :update, params: { character_id: @character.id, id: @merit.id, merit: @updated_merit_params, format: :json }
        @merit.reload

        expect(@merit.merit_cat).to eq('innate')
      end
    end

    context 'With invalid attributes' do
      it 'Updates merit attributes' do
        request.headers['Authorization'] = authenticated_header(@player)
        @invalid_updated_merit_params = FactoryBot.attributes_for(:merit, character_id: @character.id, merit_cat: 'Invalid merit_cat')

        expect(@merit.merit_cat).to eq('story')

        patch :update, params: { character_id: @character.id, id: @merit.id, merit: @invalid_updated_merit_params, format: :json }
        @merit.reload

        expect(@merit.merit_cat).to eq('story')
      end
    end

    it_behaves_like 'respond_to_unauthenticated', 'update'
  end
end

import { describe, expect, it } from 'vitest';
import { getDocsPageForTerm, searchDocs } from '../src/utils';

describe('searching for docs', () => {
  it('responds with no results', async () => {
    const results = await searchDocs('__nothing__');
    expect(results).toMatchObject({
      content: [
        {
          text: 'Failed to find any documentation for "__nothing__"',
          type: 'text',
        },
      ],
    });
  });

  it('responds with results', async () => {
    const results = await searchDocs('node3d');
    expect(results).toMatchObject({
      content: [
        {
          type: 'text',
          text: [
            'https://docs.godotengine.org/en/stable/classes/class_node3d.html',
            'https://docs.godotengine.org/en/stable/classes/class_node2d.html',
          ].join(`\n`),
        },
      ],
    });
  });

  it('responds with results 2', async () => {
    const results = await searchDocs('collision');
    expect(results).toMatchObject({
      content: [
        {
          type: 'text',
          text: [
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/collision.html',
            'https://docs.godotengine.org/en/stable/tutorials/physics/collision_shapes_2d.html',
            'https://docs.godotengine.org/en/stable/tutorials/physics/collision_shapes_3d.html',
          ].join(`\n`),
        },
      ],
    });
  });

  it('responds with results 3', async () => {
    const results = await searchDocs('collision', '4.4');
    expect(results).toMatchObject({
      content: [
        {
          type: 'text',
          text: [
            'https://docs.godotengine.org/en/4.4/tutorials/3d/particles/collision.html',
            'https://docs.godotengine.org/en/4.4/tutorials/physics/collision_shapes_2d.html',
            'https://docs.godotengine.org/en/4.4/tutorials/physics/collision_shapes_3d.html',
          ].join(`\n`),
        },
      ],
    });
  });

  it('responds with results 4', async () => {
    const results = await searchDocs('area 3d');
    expect(results).toMatchObject({
      content: [
        {
          type: 'text',
          text: [
            'https://docs.godotengine.org/en/stable/tutorials/physics/using_area_2d.html',
            'https://docs.godotengine.org/en/stable/tutorials/navigation/navigation_different_actor_area_access.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/3d_antialiasing.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/3d_text.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/3d_rendering_limitations.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/introduction_to_3d.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/standard_material_3d.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/creating_a_3d_particle_system.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/index.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/csg_tools.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/mesh_lod.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/occlusion_culling.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/attractors.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/collision.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/index.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/properties.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/subemitters.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/trails.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/turbulence.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/resolution_scaling.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/spring_arm.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/using_decals.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/using_gridmaps.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/using_transforms.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/visibility_ranges.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/volumetric_fog.html',
            'https://docs.godotengine.org/en/stable/tutorials/navigation/navigation_introduction_3d.html',
            'https://docs.godotengine.org/en/stable/tutorials/performance/optimizing_3d_performance.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/global_illumination/faking_global_illumination.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/global_illumination/index.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/high_dynamic_range.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/lights_and_shadows.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/complex_shapes.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/procedural_geometry/arraymesh.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/procedural_geometry/immediatemesh.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/procedural_geometry/index.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/procedural_geometry/meshdatatool.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/procedural_geometry/surfacetool.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/variable_rate_shading.html',
            'https://docs.godotengine.org/en/stable/tutorials/physics/collision_shapes_3d.html',
            'https://docs.godotengine.org/en/stable/tutorials/plugins/editor/3d_gizmos.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/index.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/environment_and_post_processing.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/global_illumination/introduction_to_global_illumination.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/global_illumination/reflection_probes.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/global_illumination/using_sdfgi.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/particles/process_material_properties.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/using_multi_mesh_instance.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/exporting_3d_scenes.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/retargeting_3d_skeletons.html',
            'https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/2d_and_3d_physics_interpolation.html',
            'https://docs.godotengine.org/en/stable/tutorials/shaders/your_first_shader/your_first_3d_shader.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/01.game_setup.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/going_further.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/global_illumination/using_lightmap_gi.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/global_illumination/using_voxel_gi.html',
            'https://docs.godotengine.org/en/stable/tutorials/3d/physical_light_and_camera_units.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/index.html',
            'https://docs.godotengine.org/en/stable/tutorials/shaders/your_first_shader/your_second_3d_shader.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/02.player_input.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/04.mob_scene.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/05.spawning_mobs.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/07.killing_player.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/09.adding_animations.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/03.player_movement_code.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/06.jump_and_squash.html',
            'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/08.score_and_replay.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html',
            'https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html',
            'https://docs.godotengine.org/en/stable/tutorials/best_practices/what_are_godot_classes.html',
          ].join(`\n`),
        },
      ],
    });
  });
});

describe('getting docs for page by term', () => {
  it('responds with no results', async () => {
    const results = await getDocsPageForTerm('__nothing__');
    expect(results).toMatchObject({
      content: [
        {
          text: 'Failed to find any documentation for "__nothing__"',
          type: 'text',
        },
      ],
    });
  });

  it('responds with results', async () => {
    const results = await getDocsPageForTerm('node3d');
    const docString = `URL: https://docs.godotengine.org/en/stable/classes/class_node3d.html
Content: Node3D[](#node3d "Link to this heading")`;
    expect(results.content[0].text).toContain(docString);
  });
});
